import React, {useState, useRef} from 'react';
import {View, Text, Modal, Button, Image, StyleSheet, Dimensions, TouchableOpacity, Alert, PixelRatio} from 'react-native';
import {SketchCanvas} from '@sourcetoad/react-native-sketch-canvas';
import RNPhotoManipulator from 'react-native-photo-manipulator';
import {Buffer} from 'buffer';
import {Skia} from '@shopify/react-native-skia';
import RNFS from 'react-native-fs';
const {width} = Dimensions.get('window');
export function Test() {
  const [modalVisible, setModalVisible] = useState(false);
  const [signatures, setSignatures] = useState<string[]>([]);
  const canvasRef = useRef<any>(null);
  const handleSave = async () => {
    canvasRef.current.save('jpg', false, 'signatures', String(Date.now()), true, false, false);
  };

  const [IMAGE_WIDTH, setIMAGE_WIDTH] = useState<number>(0);
  const [IMAGE_HEIGHT, setIMAGE_HEIGHT] = useState<number>(0);
  const [mergedPath, setMergedPath] = useState<string | null>(null);
  const [resultPath, setResultPath] = useState<string | null>(null);

  const mergeImages = async (backgroundUri: string, signatures: string[]) => {
    let result = backgroundUri;
    for (let i = 0; i < signatures.length; i++) {
      result = await RNPhotoManipulator.overlayImage(result, signatures[i], {x: IMAGE_WIDTH * i, y: 0});
      console.log(`拼接图路径: ${result}`);
    }
    return result;
  };

  // 提交所有签名
  const handleSubmit = async () => {
    // TODO: 这里做图片合成（拼接所有字的签名）
    console.log('最终签名：', signatures);
    setModalVisible(false);
    const totalWidth = IMAGE_WIDTH * signatures.length;
    const maxHeight = IMAGE_HEIGHT;
    console.log('背景图的宽高', totalWidth, maxHeight);
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
    setMergedPath(backgroundUri);
    console.log('创建背景图片路径:', backgroundUri);
    // 使用
    const finalPath = await mergeImages(backgroundUri, signatures);
    setResultPath(finalPath);
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <Button title='签名' onPress={() => setModalVisible(true)} />
      {resultPath && <Image source={{uri: resultPath}} style={{width: width, height: 100}} resizeMode='contain'></Image>}

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

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSignatures([]);
              }}
            >
              <View style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>取消</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => canvasRef.current.clear()}>
              <View style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>重写</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <View style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>保存</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <View style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>提交</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {flex: 1, backgroundColor: 'white'},
  title: {fontSize: 24, textAlign: 'center', margin: 10},
  footer: {flexDirection: 'row'},

  submitBtn: {
    height: 50,
    width: width / 4,
    backgroundColor: '#2080F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
});
