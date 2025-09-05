import React, {useState, useRef} from 'react';
import {View, Text, Modal, Button, Image, StyleSheet, Dimensions, TouchableOpacity, Alert} from 'react-native';
import {SketchCanvas} from '@sourcetoad/react-native-sketch-canvas';
import {Buffer} from 'buffer';
import {Skia} from '@shopify/react-native-skia';
import RNFS from 'react-native-fs';
import {Base64} from 'js-base64';

const {width} = Dimensions.get('window'); // 获取屏幕宽度，用于图片或按钮布局

export function Test() {
  // -------------------- State 定义 --------------------
  const [modalVisible, setModalVisible] = useState(false); // 控制签名弹窗显示
  const [signatures, setSignatures] = useState<string[]>([]); // 保存每次签名生成的图片路径
  const [mergedPath, setMergedPath] = useState<string | null>(null); // 最终拼接后的图片路径
  const [IMAGE_WIDTH, setIMAGE_WIDTH] = useState<number>(0); // 当前签名图片宽度
  const [IMAGE_HEIGHT, setIMAGE_HEIGHT] = useState<number>(0); // 当前签名图片高度

  const canvasRef = useRef<any>(null); // canvas 引用，用于调用 clear 或 save 方法

  // -------------------- 签名保存 --------------------
  const handleSave = async () => {
    // 保存当前签名
    // 参数说明：format='jpg', transparent=false, folder='signatures', filename=时间戳, includeImage=true
    canvasRef.current.save('jpg', false, 'signatures', String(Date.now()), true, false, false);
  };

  // -------------------- 提交签名 --------------------
  const handleSubmit = () => {
    // 点击提交，打印当前所有签名路径
    console.log('最终签名：', signatures);
    setModalVisible(false); // 关闭弹窗
    mergeImages(); // 合成所有签名图片
  };

  // -------------------- 图片合成函数 --------------------
  const mergeImages = async () => {
    console.log('signatures___________', signatures);

    try {
      const skImages: any[] = []; // 存储 Skia Image 对象
      let totalWidth = 0; // 所有图片宽度总和，用于生成最终画布宽度
      let maxHeight = 0; // 最大图片高度，用于生成画布高度

      // 遍历每张签名图片路径
      for (const uri of signatures) {
        console.log('🍎 mergeImages uri:', uri);

        // 读取图片为 base64 字符串
        const base64 = await RNFS.readFile(uri.replace('file://', ''), 'base64');

        // base64 解码为二进制
        // ⚠️ 注意这里不能用 charCodeAt，会导致部分图片解析失败
        const bytes = Buffer.from(base64, 'base64');

        // 将二进制数据转为 Skia Data
        const skData = Skia.Data.fromBytes(bytes);

        // 使用 Skia 创建 Image 对象
        const skImage = Skia.Image.MakeImageFromEncoded(skData);

        if (!skImage) {
          // 如果解析失败，跳过该图片
          console.warn('图片解析失败:', uri);
          continue;
        }

        console.log('解析成功图片宽高:', skImage.width(), skImage.height());

        // 保存成功解析的图片对象
        skImages.push(skImage);

        // 累加宽度
        totalWidth += skImage.width();

        // 记录最大高度
        maxHeight = Math.max(maxHeight, skImage.height());
      }

      if (skImages.length === 0) {
        console.warn('没有有效的图片');
        return;
      }

      // 创建一张离屏画布，宽度为所有图片宽度之和，高度为最大高度
      const surface = Skia.Surface.MakeOffscreen(totalWidth, maxHeight)!;
      const canvas = surface.getCanvas();

      // 横向绘制每张图片
      let offsetX = 0; // 当前绘制的 x 坐标
      for (const img of skImages) {
        // 底部对齐绘制，每张图片纵向偏移为 maxHeight - 当前图片高度
        const offsetY = maxHeight - img.height();
        canvas.drawImage(img, offsetX, offsetY); // 绘制图片到画布
        offsetX += img.width(); // 更新下一个图片绘制位置
      }

      // 导出最终合成图片为 Uint8Array
      const mergedImage = surface.makeImageSnapshot();
      const mergedBytes = mergedImage.encodeToBytes();

      // 写入本地缓存
      const filePath = `${RNFS.CachesDirectoryPath}/merged_signature.png`;
      await RNFS.writeFile(filePath, Buffer.from(mergedBytes).toString('base64'), 'base64');

      console.log('拼接完成，路径:', 'file://' + filePath);

      // 更新状态显示合成图片
      setMergedPath('file://' + filePath);
    } catch (e) {
      console.error('拼接失败:', e);
    }
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      {/* 签名按钮 */}
      <Button title='签名' onPress={() => setModalVisible(true)} />

      {/* 拼接后的图片展示 */}
      {mergedPath && <Image source={{uri: mergedPath}} style={{width: width, height: 100}} resizeMode='contain' />}

      {/* 签名弹窗 */}
      <Modal visible={modalVisible} animationType='slide'>
        <View style={styles.modal}>
          {/* 签名缩略图展示 */}
          <View style={{flexDirection: 'row', height: 80, backgroundColor: '#fff'}}>
            {signatures.length > 0 && signatures.map((uri, index) => <Image key={index} source={{uri}} style={{width: 100, height: 80, borderWidth: 1, borderColor: 'black'}} resizeMode='contain' />)}
          </View>

          {/* SketchCanvas 绘制区域 */}
          <SketchCanvas
            ref={canvasRef} // 引用 canvas
            style={{flex: 1, backgroundColor: 'white'}}
            strokeColor='black' // 笔迹颜色
            strokeWidth={3} // 笔迹粗细
            onSketchSaved={async (success, path) => {
              if (success) {
                const imageUri = 'file://' + path;
                console.log('签名保存路径:', imageUri);

                // 获取图片宽高
                Image.getSize(
                  imageUri,
                  (width, height) => {
                    setIMAGE_WIDTH(width);
                    setIMAGE_HEIGHT(height);
                    console.log('图片宽:', width, '高:', height);
                  },
                  error => console.error('获取图片尺寸失败:', error),
                );

                // 函数式更新签名数组，防止覆盖
                setSignatures(prev => [...prev, imageUri]);

                // 延迟清空 canvas，确保 SketchCanvas 保存完成
                setTimeout(() => {
                  canvasRef.current.clear();
                }, 50);
              }
            }}
          />

          {/* 底部按钮区域 */}
          <View style={styles.footer}>
            {/* 取消 */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSignatures([]); // 清空所有签名
              }}
            >
              <View style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>取消</Text>
              </View>
            </TouchableOpacity>

            {/* 重写 */}
            <TouchableOpacity onPress={() => canvasRef.current.clear()}>
              <View style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>重写</Text>
              </View>
            </TouchableOpacity>

            {/* 保存当前签名 */}
            <TouchableOpacity onPress={handleSave}>
              <View style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>保存</Text>
              </View>
            </TouchableOpacity>

            {/* 提交合成 */}
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

// -------------------- 样式 --------------------
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
