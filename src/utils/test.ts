// import RNFS from 'react-native-fs';
// import {Skia, Paint} from '@shopify/react-native-skia';

// const toLocalPath = (uri: string) => (uri.startsWith('file://') ? uri.replace('file://', '') : uri);

// async function loadSkImage(uri: string) {
//   // 读取为 base64
//   const b64 = await RNFS.readFile(toLocalPath(uri), 'base64');
//   // 用 Skia 自己的 Data，而不是 Buffer
//   const data = Skia.Data.fromBase64(b64);
//   if (!data) throw new Error('Skia.Data.fromBase64 失败');
//   const img = Skia.Image.MakeImageFromEncoded(data);
//   if (!img) throw new Error('Skia.Image.MakeImageFromEncoded 失败');
//   return img;
// }

// /**
//  * 将多个“单字签名图片”横向拼接为一张 PNG
//  * @param uris 单字图片的 file:// URI 列表（来自 onSketchSaved）
//  * @returns { filePath, base64, width, height }
//  */
// export async function mergeSignatureChars(uris: string[]) {
//   if (!uris.length) throw new Error('没有可拼接的图片');

//   const images = await Promise.all(uris.map(loadSkImage));

//   // 统一高度为最大高度，等比例缩放每张图
//   const targetHeight = Math.max(...images.map(i => i.height()));
//   const gap = 8; // 字与字之间的间距(px)
//   const totalWidth =
//     images.reduce((sum, img) => {
//       const scale = targetHeight / img.height();
//       return sum + Math.round(img.width() * scale) + gap;
//     }, 0) - gap;

//   const surface = Skia.Surface.MakeOffscreen(totalWidth, targetHeight);
//   if (!surface) throw new Error('Skia.Surface.MakeOffscreen 失败');

//   const canvas = surface.getCanvas();
//   const paint = new Paint();

//   // 白底（如果要透明底，改为 canvas.clear(0x00000000)）
//   canvas.clear(Skia.Color('white'));

//   let x = 0;
//   for (const img of images) {
//     const scale = targetHeight / img.height();
//     const destW = Math.round(img.width() * scale);
//     const srcRect = {x: 0, y: 0, width: img.width(), height: img.height()};
//     const destRect = {x, y: 0, width: destW, height: targetHeight};
//     // 按矩形绘制，实现缩放
//     canvas.drawImageRect(img, srcRect, destRect, paint);
//     x += destW + gap;
//   }

//   const snapshot = surface.makeImageSnapshot();
//   const base64 = snapshot.encodeToBase64(); // PNG base64
//   const filePath = `${RNFS.CachesDirectoryPath}/final_signature_${Date.now()}.png`;
//   await RNFS.writeFile(filePath, base64, 'base64');

//   return {filePath, base64, width: totalWidth, height: targetHeight};
// }
