import React, {JSX, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  useWindowDimensions,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  CameraPosition,
  DrawableFrame,
  Frame,
  PhotoFile,
  Camera as VisionCamera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/core';
import {useAppState} from '@react-native-community/hooks';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {
  Camera,
  Face,
  FaceDetectionOptions,
  Contours,
  Landmarks,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import {ClipOp, Skia, TileMode} from '@shopify/react-native-skia';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {api} from '@/api/request';
import {useProject} from '@/stores/userProject';
import LoadingOverlay from '../LoadingOverlay';
// 屏幕中间虚线框的尺寸
const BOX_WIDTH = 250;
const BOX_HEIGHT = 350;
export function FaceRecognitionPunch(): JSX.Element {
  const processingRef = useRef(true);
  const stopFrameProcessing = () => {
    processingRef.current = false;
  };
  const startFrameProcessing = () => {
    processingRef.current = true;
  };
  const [title, setTitle] = useState<string>('查找中...');
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const {myProject} = useProject();
  const {width, height} = useWindowDimensions();
  const {hasPermission, requestPermission} = useCameraPermission();
  const [cameraMounted, setCameraMounted] = useState<boolean>(false);
  const [cameraPaused, setCameraPaused] = useState<boolean>(false);
  const [autoMode, setAutoMode] = useState<boolean>(true);
  const [cameraFacing, setCameraFacing] = useState<CameraPosition>('back');
  const cameraDevice = useCameraDevice(cameraFacing);
  // const faceDetectionOptions = useRef<FaceDetectionOptions>({
  // performanceMode: 'fast',     // 性能模式：'fast'（快，牺牲精度） or 'accurate'（慢，但更准）
  // classificationMode: 'all',   // 分类模式：是否检测表情相关属性（睁眼、微笑、头部姿态）
  // contourMode: 'all',          // 轮廓模式：是否返回人脸轮廓点（五官、外轮廓的关键点）
  // landmarkMode: 'all',         // 特征点模式：是否检测关键点（眼睛、鼻子、嘴巴等）
  // windowWidth: width,          // 检测窗口宽度（通常是相机预览区域）
  // windowHeight: height,        // 检测窗口高度
  // }).current;
  // 手持 测试 参数
  let contourSupport: 'all' | 'none' = 'all';
  useEffect(() => {
    if (cameraDevice) {
      console.log('当前相机设备信息:', cameraDevice);
      if (cameraDevice.position === 'back') {
        contourSupport = 'none';
      } else {
        contourSupport = 'all';
      }
    }
  }, [cameraDevice]);
  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'fast',
    classificationMode: 'all',
    landmarkMode: 'all',
    contourMode: contourSupport, // 手持后置不支持
    windowWidth: width,
    windowHeight: height,
  }).current;
  const {stopListeners} = useFaceDetector(faceDetectionOptions);
  const isFocused = useIsFocused();
  const appState = useAppState();
  const [showText, setShowText] = useState('');

  const [isActive, setIsActive] = useState(true);
  const isCameraActive = !cameraPaused && isFocused && appState === 'active';

  //
  // vision camera ref
  //
  const camera = useRef<VisionCamera>(null);
  //
  // face rectangle position
  //
  const aFaceW = useSharedValue(0);
  const aFaceH = useSharedValue(0);
  const aFaceX = useSharedValue(0);
  const aFaceY = useSharedValue(0);
  const aRot = useSharedValue(0);
  const boundingBoxStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    borderWidth: 4,
    borderLeftColor: 'rgb(0,255,0)',
    borderRightColor: 'rgb(0,255,0)',
    borderBottomColor: 'rgb(0,255,0)',
    borderTopColor: 'rgb(0,255,0)',
    // borderTopColor: 'rgb(255,0,0)',
    width: withTiming(aFaceW.value, {
      duration: 100,
    }),
    height: withTiming(aFaceH.value, {
      duration: 100,
    }),
    left: withTiming(aFaceX.value, {
      duration: 100,
    }),
    top: withTiming(aFaceY.value, {
      duration: 100,
    }),
    transform: [
      {
        rotate: `${aRot.value}deg`,
      },
    ],
  }));

  useEffect(() => {
    if (hasPermission) return;
    requestPermission();
  }, []);

  function handleUiRotation(rotation: number) {
    aRot.value = rotation;
  }

  function handleCameraMountError(error: any) {
    console.error('camera mount error', error);
  }

  function handleFacesDetected(faces: Face[], frame: Frame): void {
    console.log(faces);
    if (!processingRef.current) return; // 停止处理

    if (faces.length <= 0) {
      aFaceW.value = 0;
      aFaceH.value = 0;
      aFaceX.value = 0;
      aFaceY.value = 0;
      setShowText('未识别到人脸');
      return;
    }
    if (faces.length > 1) {
      setShowText('只能一个人脸');
      return;
    }

    const face = faces[0];

    const {bounds} = faces[0];
    const {width, height, x, y} = bounds;
    aFaceW.value = width;
    aFaceH.value = height;
    aFaceX.value = x;
    aFaceY.value = y;

    if (
      aFaceX.value >= boxLeft &&
      aFaceX.value + aFaceW.value <= boxRight &&
      aFaceY.value >= boxTop &&
      aFaceY.value + aFaceH.value <= boxBottom
    ) {
      // 👁️ 眼睛闭合检测
      if (
        face.leftEyeOpenProbability < 0.8 &&
        face.rightEyeOpenProbability < 0.8
      ) {
        setShowText('请睁眼');
        return;
      }

      // 🎯 正面朝向检测
      // pitchAngle = 点头上下角度
      // rollAngle = 头部倾斜角度（歪头）
      // yawAngle = 左右转头角度
      if (
        !(
          Math.abs(face.pitchAngle) < 6 &&
          Math.abs(face.rollAngle) < 6 &&
          Math.abs(face.yawAngle) < 6
        )
      ) {
        setShowText('请正面朝向屏幕');
        return;
      }

      // ✅ 所有检测通过 -> 拍照
      setShowText('检测到人脸，准备拍照');
      takePicture();
      stopFrameProcessing(); // 👉 拍照后立刻停止帧处理
    } else {
      setShowText('人脸需在虚线框内');
      return;
    }
  }

  const [photo, setPhoto] = useState<PhotoFile | null>(null);
  const photoRef = useRef<PhotoFile | null>(null);
  const takePicture = async () => {
    console.log(222);
    if (photoRef.current) return;
    if (camera.current) {
      try {
        setActivityLoading(true);
        const p = await camera.current.takePhoto();
        console.log('🍎 ~ 照片 ~ photo:', p);
        photoRef.current = p;
        const formData = new FormData();
        formData.append('projectId', myProject?.snowFlakeId || '');
        formData.append('face', {
          uri: Platform.OS === 'ios' ? p.path : `file://${p.path}`,
          name: 'face.jpg',
          type: 'image/jpeg',
        } as any);

        try {
          const response = await api.post(
            '/wechat/common/getUserByFace',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );

          console.log('✅ ~ takePicture ~ response:', response);
          Alert.alert('提示', '可以跳转新页面', [
            {
              text: '确定',
              onPress: () => {
                photoRef.current = null; // 清空，允许再次拍照
                startFrameProcessing();
              },
            },
          ]);
        } catch (error) {
          console.log('❌ ~ takePicture ~ error:', error);
          // @ts-ignore
          Alert.alert('提示', error.message, [
            {
              text: '确定',
              onPress: () => {
                console.log(333);
                photoRef.current = null; // 清空，允许再次拍照
                startFrameProcessing();
              },
            },
          ]);
        }
      } catch (error) {
        console.error('❌ ~ takePicture ~ error:', error);
      } finally {
        setActivityLoading(false);
      }
    }
  };

  function handleSkiaActions(faces: Face[], frame: DrawableFrame): void {
    'worklet';
    // if no faces are detected we do nothing
    // console.log('handleSkiaActions', 444);
    // if (!processingRef.current) return; // 停止处理
    // console.log('handleSkiaActions', 555);

    if (faces.length <= 0) return;

    // console.log('SKIA - faces', faces.length, 'frame', frame.toString());

    const {bounds, contours, landmarks} = faces[0];

    // draw a blur shape around the face points
    const blurRadius = 25;
    const blurFilter = Skia.ImageFilter.MakeBlur(
      blurRadius,
      blurRadius,
      TileMode.Repeat,
      null,
    );
    const blurPaint = Skia.Paint();
    blurPaint.setImageFilter(blurFilter);
    const contourPath = Skia.Path.Make();
    const necessaryContours: (keyof Contours)[] = [
      'FACE',
      'LEFT_CHEEK',
      'RIGHT_CHEEK',
    ];

    necessaryContours.map(key => {
      contours?.[key]?.map((point, index) => {
        if (index === 0) {
          // it's a starting point
          contourPath.moveTo(point.x, point.y);
        } else {
          // it's a continuation
          contourPath.lineTo(point.x, point.y);
        }
      });
      contourPath.close();
    });

    frame.save();
    frame.clipPath(contourPath, ClipOp.Intersect, true);
    frame.render(blurPaint);
    frame.restore();

    // draw mouth shape
    const mouthPath = Skia.Path.Make();
    const mouthPaint = Skia.Paint();
    mouthPaint.setColor(Skia.Color('red'));
    const necessaryLandmarks: (keyof Landmarks)[] = [
      'MOUTH_BOTTOM',
      'MOUTH_LEFT',
      'MOUTH_RIGHT',
    ];

    necessaryLandmarks.map((key, index) => {
      const point = landmarks?.[key];
      if (!point) return;

      if (index === 0) {
        // it's a starting point
        mouthPath.moveTo(point.x, point.y);
      } else {
        // it's a continuation
        mouthPath.lineTo(point.x, point.y);
      }
    });
    mouthPath.close();
    frame.drawPath(mouthPath, mouthPaint);

    // draw a rectangle around the face
    const rectPaint = Skia.Paint();
    rectPaint.setColor(Skia.Color('blue'));
    rectPaint.setStyle(1);
    rectPaint.setStrokeWidth(5);
    frame.drawRect(bounds, rectPaint);
  }

  // 居中的虚线框坐标
  const boxLeft = (width - BOX_WIDTH) / 2;
  const boxTop = (height - BOX_HEIGHT) / 2;
  const boxRight = boxLeft + BOX_WIDTH;
  const boxBottom = boxTop + BOX_HEIGHT;
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <>
          <Camera
            photo={true}
            ref={camera}
            style={StyleSheet.absoluteFill}
            isActive={isActive}
            // @ts-ignore
            device={cameraDevice}
            onError={handleCameraMountError}
            onUIRotationChanged={handleUiRotation}
            // @ts-ignore

            faceDetectionOptions={{
              ...faceDetectionOptions,
              autoMode,
              cameraFacing,
            }}
            faceDetectionCallback={handleFacesDetected}
            skiaActions={handleSkiaActions}
          />
          {/* 中间虚线框 */}
          <View
            style={{
              position: 'absolute',
              left: boxLeft,
              top: boxTop,
              width: BOX_WIDTH,
              height: BOX_HEIGHT,
              borderWidth: 2,
              borderColor: 'white',
              borderStyle: 'dashed',
            }}
          />

          <TouchableOpacity
            style={styles.fab}
            onPress={async () => {
              setCameraFacing(current =>
                current === 'front' ? 'back' : 'front',
              );
            }}>
            <Text style={styles.fabText}>切换镜头</Text>
          </TouchableOpacity>

          <Animated.View style={boundingBoxStyle} />
        </>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Text
          style={{
            fontSize: 22,
            width: '100%',
            textAlign: 'center',
            color: 'white',
          }}>
          {showText}
        </Text>
        <LoadingOverlay visible={activityLoading} title={title} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fab: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 50,
    backgroundColor: '#2080F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fabText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
