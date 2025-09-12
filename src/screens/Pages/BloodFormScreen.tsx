import {useSkipBack} from '@/hooks/useSkipBack';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import {launchCamera} from 'react-native-image-picker';
import RNPhotoManipulator from 'react-native-photo-manipulator';
import {Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Image, Modal, PixelRatio, Platform, StatusBar} from 'react-native';
import {Button as NButton} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {useRef, useState} from 'react';
import {useProject} from '@/stores/userProject';
import Ionicons from '@react-native-vector-icons/ionicons';
import {ImageLibraryOptions, launchImageLibrary} from 'react-native-image-picker';
import DialogWithRadioBtns from '@/components/DialogWithRadioBtns';
import {SketchCanvas} from '@sourcetoad/react-native-sketch-canvas';
import {Skia} from '@shopify/react-native-skia';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackActions} from '@react-navigation/native';
import type {RootStackParamList} from '@/navigation/types';
import {getPreSignedUrl, getPreSignedUrlFromKey} from '@/utils/upload';
import {api} from '@/api/request';
import Svg, {Line} from 'react-native-svg';
import CustomInput from '@/components/CustomInput';
import {ConfirmAlert} from '@/components/ConfirmDialog/ConfirmDialogProvider';
import {LoadingModal} from '@/components/LoadingModal';
type Props = NativeStackScreenProps<RootStackParamList, 'BloodForm'>;
const {width, height} = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
const customHeight = height - 132 - statusBarHeight;
export function BloodFormScreen({route, navigation}: Props) {
  console.log('route.params', route.params);
  useSkipBack<RootStackParamList>(2, 'BloodForm');
  const {myProject} = useProject();
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('照片上传中...');
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [face, setFace] = useState<string>();
  const [faceBlob, setFaceBlob] = useState<any>(null);

  const [confirmAction, setConfirmAction] = useState<((val?: string) => void) | null>(null);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      high: '',
      low: '',
      heartbeat: '',
      face: '',
      signature: '',
      remark: '',
    },
  });
  const [signObjectKey, setSignObjectKey] = useState<string | null>(null);
  const onSubmit = (data: any) => {
    if (!signObjectKey) {
      ConfirmAlert.alert('提示', '请签名', [{text: '确定', onPress: () => {}}]);
      return;
    }
    const params = {
      projectId: myProject?.snowFlakeId, //项目id
      // @ts-ignore
      baseUserId: route.params.params.snowFlakeId, //用户id
      high: data.high,
      low: data.high,
      heartbeat: data.high,
      remark: data.high,
      signature: signObjectKey,
    };

    const formData = new FormData();

    // 普通字段
    formData.append('params', JSON.stringify(params));

    // 文件字段
    formData.append('face', {
      uri: faceBlob.uri, // 本地文件路径
      name: faceBlob.fileName || 'photo.jpg', // 文件名
      type: faceBlob.type || 'image/jpeg', // MIME 类型
    });
    console.log('🍎 ~ onSubmit ~ formData:', formData);
    console.log('🍎 ~ onSubmit ~ submitData:', {params: JSON.stringify(params), face: faceBlob});
    setActivityLoading(true);
    setTitle('采集上传中...');
    api
      .post('/wechat/inspect/bloodPressure', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        console.log('🍎 ~ onSubmit ~ res:', res);
        ConfirmAlert.alert('提示', res.message, [
          {text: '取消', style: 'cancel', onPress: () => {}},
          {text: '确定', onPress: () => navigation.dispatch(StackActions.pop(2))},
        ]);
      })
      .catch(error => {
        console.log('🍎 ~ onSubmit ~ error:', error);
        ConfirmAlert.alert('提示', error.message, [{text: '确定', onPress: () => {}}]);
      })
      .finally(() => {
        setActivityLoading(false);
      });
  };
  const takePhoto = async (onChange: (val: string) => void) => {
    try {
      launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
        if (response.assets && response.assets[0].uri) {
          setFace(response.assets[0].uri);
          setFaceBlob(response.assets[0]);
          onChange(response.assets[0].uri);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        ConfirmAlert.alert('提示', error.message, [{text: '确定', onPress: () => {}}]);
      } else {
        ConfirmAlert.alert('提示', String(error), [{text: '确定', onPress: () => {}}]);
      }
    } finally {
    }
  };

  const pickImage = async (onChange: (val: string) => void) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo', // 只选照片
      selectionLimit: 1, // 限制只能选一张
      quality: 1, // 图片质量（0-1）
    };

    try {
      launchImageLibrary(options, response => {
        console.log('🍎 ~ pickImage ~ response:', response);
        if (response.assets && response.assets[0].uri) {
          setFace(response.assets[0].uri);
          setFaceBlob(response.assets[0]);
          onChange(response.assets[0].uri);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        ConfirmAlert.alert('提示', error.message, [{text: '确定', onPress: () => {}}]);
      } else {
        ConfirmAlert.alert('提示', String(error), [{text: '确定', onPress: () => {}}]);
      }
    } finally {
    }
  };
  function switchType(onChange: (val: string) => void) {
    setVisible(true);

    setConfirmAction(() => (val?: string) => {
      console.log('🍎 ~ switchType ~ val:', val);
      if (!val) return;
      const actions: Record<string, () => void> = {
        '1': () => takePhoto(onChange),
        '2': () => pickImage(onChange),
      };

      actions[val]?.();
    });
  }
  const canvasRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [IMAGE_WIDTH, setIMAGE_WIDTH] = useState<number>(0);
  const [IMAGE_HEIGHT, setIMAGE_HEIGHT] = useState<number>(0);
  const [resultPath, setResultPath] = useState<string | null>(null);
  const handleSave = async () => {
    canvasRef.current.save('jpg', false, 'signatures', String(Date.now()), true, false, false);
  };

  const mergeImages = async (backgroundUri: string, signatures: string[]) => {
    let result = backgroundUri;
    const spaceWidth = IMAGE_WIDTH / 4;
    for (let i = 0; i < signatures.length; i++) {
      result = await RNPhotoManipulator.overlayImage(result, signatures[i], {x: i === 0 ? IMAGE_WIDTH * i : IMAGE_WIDTH * i - spaceWidth * i, y: 0});
    }
    return result;
  };
  type UploadResult = {
    objectKey: string;
    previewUrl: string;
  };
  async function uploadSignPhoto(fileName: string, uri: string): Promise<UploadResult> {
    try {
      const uploadName = fileName;
      const {objectKey, preSignedUrl} = await getPreSignedUrl(uploadName, 'sign');
      const res = await fetch(uri);
      const blob = await res.blob();
      await fetch(preSignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {'Content-Type': 'image/jpeg'},
      });
      const previewUrl = await getPreSignedUrlFromKey(objectKey);
      return {objectKey, previewUrl};
    } catch (err) {
      throw err; // 抛出异常，保证函数返回类型始终是 UploadResult 或异常
    }
  }
  // 提交所有签名

  const signSubmit = async () => {
    if (signatures.length === 0) {
      ConfirmAlert.alert('提示', '请签名', [{text: '确定', onPress: () => {}}]);
      return;
    }
    setModalVisible(false);
    try {
      setActivityLoading(true);
      setTitle('签名上传中...');
      const spaceWidth = IMAGE_WIDTH / 4;
      const totalWidth = IMAGE_WIDTH * signatures.length - spaceWidth * signatures.length - 1;
      const maxHeight = IMAGE_HEIGHT;
      const surface = Skia.Surface.MakeOffscreen(totalWidth, maxHeight)!;
      const canvas = surface.getCanvas();
      // 填充白色背景
      const paint = Skia.Paint();
      paint.setColor(Skia.Color('white'));
      canvas.drawRect(Skia.XYWHRect(0, 0, totalWidth, maxHeight), paint);
      // 1. 导出内存里的图像
      const mergedImage = surface.makeImageSnapshot();
      // 2. 编码成 PNG / JPG 二进制
      const bytes = mergedImage.encodeToBytes(); // Uint8Array
      // 3. 写入文件系统
      const filePath = `${RNFS.CachesDirectoryPath}/background.png`;
      await RNFS.writeFile(filePath, Buffer.from(bytes).toString('base64'), 'base64');
      // 4. 得到本地图片路径
      const backgroundUri = 'file://' + filePath;
      console.log('🍎 ~ signSubmit ~ backgroundUri:', backgroundUri);
      // 使用
      const finalPath = await mergeImages(backgroundUri, signatures);
      const fileName = finalPath.split('/').pop() as string;

      const {objectKey, previewUrl} = await uploadSignPhoto(fileName, finalPath);

      setResultPath(previewUrl);
      setSignObjectKey(objectKey);
      setSignatures([]);
    } catch (error) {
      console.log('🍎 ~ signSubmit ~ error:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  function toSign(onChange: (val: string) => void) {
    setModalVisible(true);
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1, margin: 8}}>
        <Controller
          name='face'
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text style={styles.requiredStyle}>*</Text>
              <Text style={[styles.bigText, {marginRight: 10}]}>人脸</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  switchType(onChange);
                }}
                style={styles.upLoadStyle}
              >
                <Ionicons name={'camera'} size={50} color={'#aaa'} />
              </TouchableOpacity>

              {face && (
                <TouchableOpacity
                  onLongPress={() => {
                    ConfirmAlert.alert('删除确认', '确定要删除这张图片吗？', [
                      {text: '取消', style: 'cancel', onPress: () => {}},
                      {
                        text: '确定',
                        onPress: () => {
                          onChange('');
                          setFace('');
                        },
                      },
                    ]);
                  }}
                  delayLongPress={1000}
                >
                  <Image source={{uri: face}} style={styles.preview} />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        {errors.face && <Text style={styles.errorText}>请上传照片</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.list}>
              <Text style={styles.requiredStyle}>*</Text>
              <Text style={styles.bigText}>血压最高值：</Text>
              <View>
                <CustomInput style={{width: 180}} height={30} keyboardType='numeric' value={value} onChangeText={onChange} placeholder='请输入血压最高值' />
              </View>
            </View>
          )}
          name='high'
        />
        {errors.high && <Text style={styles.errorText}>请输入血压最高值</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.list}>
              <Text style={styles.requiredStyle}>*</Text>
              <Text style={styles.bigText}>血压最低值：</Text>
              <View>
                <CustomInput style={{width: 180}} height={30} keyboardType='numeric' value={value} onChangeText={onChange} placeholder='请输入血压最低值' />
              </View>
            </View>
          )}
          name='low'
        />
        {errors.low && <Text style={styles.errorText}>请输入血压最低值</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={styles.list}>
              <Text style={styles.requiredStyle}>*</Text>
              <Text style={styles.bigText}>每分钟心跳：</Text>
              <View>
                <CustomInput style={{width: 180}} height={30} keyboardType='numeric' value={value} onChangeText={onChange} placeholder='请输入每分钟心跳' />
              </View>
            </View>
          )}
          name='heartbeat'
        />
        {errors.heartbeat && <Text style={styles.errorText}>请输入每分钟心跳</Text>}

        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.requiredStyle}>*</Text>
                <NButton
                  style={{
                    borderRadius: 0,
                    margin: 8,
                    backgroundColor: '#2080F0',
                  }}
                  mode='contained'
                  onPress={() => {
                    toSign(onChange);
                  }}
                >
                  去签名
                </NButton>
              </View>

              {resultPath && <Image source={{uri: resultPath}} style={{height: 100}} resizeMode='contain'></Image>}
            </View>
          )}
          name='signature'
        />
        {errors.signature && <Text style={styles.errorText}>请签名</Text>}

        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View>
              <Text style={styles.bigText}>备注：</Text>
              <CustomInput height={80} value={value} onChangeText={onChange} placeholder='请输入备注' />
            </View>
          )}
          name='remark'
        />
        {errors.remark && <Text style={styles.errorText}>请输入备注</Text>}
      </ScrollView>
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <View style={styles.submitBtn}>{loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.submitBtnText}>确认</Text>}</View>
      </TouchableOpacity>
      <DialogWithRadioBtns
        data={[
          {
            label: '拍照',
            value: '1',
          },
          {
            label: '相册',
            value: '2',
          },
        ]}
        visible={visible}
        close={function () {
          setVisible(false);
        }}
        confirm={function (val) {
          console.log('🍎 ~ function ~ val:', val);
          confirmAction?.(val);
          setVisible(false);
        }}
      ></DialogWithRadioBtns>
      <LoadingModal visible={activityLoading} title={title} />
      <Modal visible={modalVisible} animationType='slide'>
        <View style={styles.modal}>
          <View style={{flexDirection: 'row', height: 82, backgroundColor: '#ccc'}}>
            {signatures.length > 0 &&
              signatures.map((uri, index) => {
                return <Image key={index} source={{uri}} style={{width: 100, height: 80, borderWidth: 1, borderColor: 'black'}} resizeMode='contain'></Image>;
              })}
          </View>

          <SketchCanvas
            ref={canvasRef}
            style={{flex: 1, backgroundColor: 'white'}}
            strokeColor='black'
            strokeWidth={3}
            onSketchSaved={(success, path) => {
              if (success) {
                const imageUri = 'file://' + path;
                Image.getSize(
                  imageUri,
                  (width, height) => {
                    console.log('PixelRatio.getPixelSizeForLayoutSize(width)', PixelRatio.getPixelSizeForLayoutSize(width));

                    setIMAGE_WIDTH(PixelRatio.getPixelSizeForLayoutSize(width));
                    setIMAGE_HEIGHT(PixelRatio.getPixelSizeForLayoutSize(height));
                  },
                  error => {
                    console.error('获取图片尺寸失败:', error);
                  },
                );

                setSignatures([...signatures, imageUri]);
                canvasRef.current.clear();
              }
            }}
          />
          {/* 米字格 */}
          <Svg pointerEvents='none' width={width} height={customHeight} style={{position: 'absolute', top: 82, left: 0}}>
            {/* 中心横线 */}
            <Line x1='0%' y1='50%' x2='100%' y2='50%' stroke='#ccc' strokeWidth='1' strokeDasharray={[4, 4]} />
            {/* 中心竖线 */}
            <Line x1='50%' y1='0%' x2='50%' y2='100%' stroke='#ccc' strokeWidth='1' strokeDasharray={[4, 4]} />
            {/* 左上到右下斜线 */}
            <Line x1='0%' y1='0%' x2='100%' y2='100%' stroke='#ccc' strokeWidth='1' strokeDasharray={[4, 4]} />
            {/* 右上到左下斜线 */}
            <Line x1='100%' y1='0%' x2='0%' y2='100%' stroke='#ccc' strokeWidth='1' strokeDasharray={[4, 4]} />
          </Svg>
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSignatures([]);
              }}
            >
              <View style={styles.signBtn}>
                <Text style={styles.signBtnText}>取消</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => canvasRef.current.clear()}>
              <View style={styles.signBtn}>
                <Text style={styles.signBtnText}>重写</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <View style={styles.signBtn}>
                <Text style={styles.signBtnText}>保存</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={signSubmit}>
              <View style={styles.signBtn}>
                <Text style={styles.signBtnText}>提交</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainerStyle: {
    margin: 8,
    width: 310,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
  },

  submitBtn: {
    height: 50,
    width: width,
    backgroundColor: '#2080F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  submitBtnText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  fixedHeight: {
    margin: 8,
    width: 310,
    height: 80,
    backgroundColor: '#fff',
  },
  bigText: {
    // width: 60,
    fontSize: 22,
  },

  upLoadStyle: {
    height: 100,
    width: 100,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#aaa',
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  preview: {
    height: 100,
    width: 100,
    marginLeft: 10,
    borderRadius: 10,
  },
  modal: {flex: 1, backgroundColor: 'white'},
  title: {fontSize: 24, textAlign: 'center', margin: 10},
  footer: {flexDirection: 'row'},

  signBtn: {
    height: 50,
    width: width / 4,
    backgroundColor: '#2080F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  requiredStyle: {
    fontSize: 22,
    color: '#FF0000',
  },
});
