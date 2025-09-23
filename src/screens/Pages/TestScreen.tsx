import {ImagePreview} from '@/components/ImagePreview';
import {useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const images = [
  'https://img.shetu66.com/2023/06/21/1687308186011156.png',
  'https://cdn.britannica.com/02/132502-050-F4667944/macaw.jpg',
  'https://assets-global.website-files.com/63634f4a7b868a399577cf37/64665685a870fadf4bb171c2_labrador%20americano.jpg',
  'https://i0.wp.com/bcc-newspack.s3.amazonaws.com/uploads/2023/05/052323-Foxes-in-Millennium-Park-Colin-Boyle-9124.jpg?fit=1650%2C1099&ssl=1',
];
export function Signature() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView style={{flex: 1}}>
      <Button mode='outlined' onPress={() => setModalVisible(true)}>
        click
      </Button>
      <Modal visible={modalVisible} animationType='slide' onRequestClose={() => setModalVisible(false)}>
        <GestureHandlerRootView>
          <View style={styles.modal}>
            <ImagePreview imageList={images} initialIndex={2}></ImagePreview>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  modal: {flex: 1},
});

// 不能删除此注释代码、有参考价值
// 签名测试
// import React, {useRef, useState} from 'react';
// import {View, Button, Image, ScrollView, PanResponder, Dimensions} from 'react-native';
// import Canvas, {Image as CanvasImage} from 'react-native-canvas';
// const {width, height} = Dimensions.get('window');
// const CANVAS_WIDTh = width;
// const CANVAS_HEIGHT = height * 0.5;

// export function Signature() {
//   const canvasRef = useRef<Canvas | null>(null);
//   const ctxRef = useRef<any>(null);
//   const mergeCanvasRef = useRef<Canvas | null>(null);
//   const mergeCtxRef = useRef<any>(null);

//   const [chars, setChars] = useState<{uri: string}[]>([]);
//   const [finalUri, setFinalUri] = useState<string>();

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderGrant: evt => {
//         const ctx = ctxRef.current;
//         if (!ctx) return;
//         const {locationX, locationY} = evt.nativeEvent;
//         ctx.beginPath();
//         ctx.moveTo(locationX, locationY);
//       },
//       onPanResponderMove: evt => {
//         const ctx = ctxRef.current;
//         if (!ctx) return;
//         const {locationX, locationY} = evt.nativeEvent;
//         ctx.lineTo(locationX, locationY);
//         ctx.stroke();
//       },
//       onPanResponderRelease: () => {},
//     }),
//   ).current;

//   const handleCanvas = (canvas: Canvas) => {
//     if (!canvas) return;
//     canvas.width = CANVAS_WIDTh;
//     canvas.height = CANVAS_HEIGHT;
//     const ctx = canvas.getContext('2d');
//     ctx.strokeStyle = 'black';
//     ctx.lineWidth = 2;
//     ctxRef.current = ctx;
//     canvasRef.current = canvas;
//   };

//   const handleMergeCanvas = (canvas: Canvas) => {
//     if (!canvas) return;
//     mergeCanvasRef.current = canvas;
//     mergeCtxRef.current = canvas.getContext('2d');
//   };

//   function clear() {
//     setChars([]);
//     setFinalUri(undefined);
//   }

//   const saveChar = async () => {
//     if (!canvasRef.current) return;
//     let uri: string = await canvasRef.current.toDataURL('image/png');
//     if (uri.startsWith('"') && uri.endsWith('"')) {
//       uri = uri.slice(1, -1);
//     }
//     setChars(prev => [...prev, {uri}]);

//     const ctx = ctxRef.current;
//     if (ctx) {
//       ctx.clearRect(0, 0, CANVAS_WIDTh, CANVAS_HEIGHT);
//     }
//   };

//   const mergeChars = async () => {
//     try {
//       if (!mergeCanvasRef.current || !mergeCtxRef.current) {
//         console.log('合成 Canvas 未就绪');
//         return;
//       }
//       const canvas = mergeCanvasRef.current;
//       const ctx = mergeCtxRef.current;

//       const width = chars.length * 100;
//       const height = 100;
//       canvas.width = width;
//       canvas.height = height;
//       ctx.clearRect(0, 0, width, height);

//       for (let i = 0; i < chars.length; i++) {
//         const img = new CanvasImage(canvas);
//         img.src = chars[i].uri;
//         await new Promise<void>(resolve => {
//           img.addEventListener('load', () => {
//             ctx.drawImage(img, i * 100, 0, 100, 100);
//             resolve();
//           });
//         });
//       }

//       let uri: string = await canvas.toDataURL('image/png');
//       if (uri.startsWith('"') && uri.endsWith('"')) {
//         uri = uri.slice(1, -1);
//       }
//       console.log('最终合成图:', uri);
//       setFinalUri(uri);
//     } catch (error) {
//       console.log('🍎 ~ mergeChars ~ error:', error);
//     }
//   };

//   return (
//     <View style={{flex: 1, paddingTop: 50}}>
//       <View {...panResponder.panHandlers} style={{width: CANVAS_WIDTh, height: CANVAS_HEIGHT, borderWidth: 1, borderColor: '#000'}}>
//         <Canvas ref={handleCanvas} style={{flex: 1}} />
//       </View>

//       <View style={{flexDirection: 'row'}}>
//         <Button title='取消' onPress={clear} />
//         <Button title='保存当前字' onPress={saveChar} />
//         <Button title='合成全部字' onPress={mergeChars} />
//       </View>

//       <ScrollView horizontal style={{marginTop: 16}}>
//         {chars.map((char, index) => (
//           <Image key={index} source={{uri: char.uri}} style={{width: 100, height: 100, borderWidth: 1, borderColor: 'black'}} />
//         ))}
//       </ScrollView>
//       {finalUri && <Image resizeMode='contain' source={{uri: finalUri}} style={{width: width, height: 200, borderWidth: 1, borderColor: 'black'}} />}

//       <Canvas ref={handleMergeCanvas} style={{width: 0, height: 0}} />
//     </View>
//   );
// }
