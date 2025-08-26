// import React from 'react';
// import { Image, useWindowDimensions } from 'react-native';
// import {
//   fitContainer,
//   ResumableZoom,
//   useImageResolution,
// } from 'react-native-zoom-toolkit';

// const uri = 'https://img.shetu66.com/2023/06/21/1687308186011156.png';

// export const ImagePreview = () => {
//   const { width, height } = useWindowDimensions();
//   const { isFetching, resolution } = useImageResolution({ uri });
//   if (isFetching || resolution === undefined) {
//     return null;
//   }

//   const size = fitContainer(resolution.width / resolution.height, {
//     width,
//     height,
//   });

//   return (
//     <ResumableZoom maxScale={resolution}>
//       <Image source={{ uri }} style={{ ...size }} resizeMethod={'scale'} />
//     </ResumableZoom>
//   );
// };

import React, { useCallback, useRef } from 'react';
import {
  stackTransition,
  Gallery,
  type GalleryRefType,
} from 'react-native-zoom-toolkit';

import GalleryImage from './GalleryImage';

const images = [
  'https://img.shetu66.com/2023/06/21/1687308186011156.png',
  'https://cdn.britannica.com/02/132502-050-F4667944/macaw.jpg',
  'https://assets-global.website-files.com/63634f4a7b868a399577cf37/64665685a870fadf4bb171c2_labrador%20americano.jpg',
  'https://i0.wp.com/bcc-newspack.s3.amazonaws.com/uploads/2023/05/052323-Foxes-in-Millennium-Park-Colin-Boyle-9124.jpg?fit=1650%2C1099&ssl=1',
];

export const ImagePreview = () => {
  const ref = useRef<GalleryRefType>(null);

  // Remember to memoize your callbacks properly to keep a decent performance
  const renderItem = useCallback((item: string, index: number) => {
    return <GalleryImage uri={item} index={index} />;
  }, []);

  const keyExtractor = useCallback((item: string, index: number) => {
    return `${item}-${index}`;
  }, []);

  const onTap = useCallback((_: any, index: number) => {
    console.log(`Tapped on index ${index}`);
  }, []);

  const transition = useCallback(stackTransition, []);

  return (
    <Gallery
      ref={ref}
      data={images}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onTap={onTap}
      customTransition={transition}
    />
  );
};
