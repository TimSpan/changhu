// ImagePreview.tsx
import React, {useCallback, useRef, useState} from 'react';
import {stackTransition, Gallery, type GalleryRefType} from 'react-native-zoom-toolkit';
import {View, Text, StyleSheet} from 'react-native';
import GalleryImage from './GalleryImage';
interface Props {
  initialIndex?: number;
  imageList: string[];
}

export const ImagePreview = ({initialIndex = 0, imageList}: Props) => {
  const ref = useRef<GalleryRefType>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const renderItem = useCallback((item: string, index: number) => {
    return <GalleryImage uri={item} index={index} />;
  }, []);

  const keyExtractor = useCallback((item: string, index: number) => {
    return `${item}-${index}`;
  }, []);

  const onIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const transition = useCallback(stackTransition, []);

  return (
    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
      {/* 顶部显示 当前/总数 */}
      <View style={styles.topBar}>
        <Text style={styles.counter}>
          {currentIndex + 1}/{imageList.length}
        </Text>
      </View>

      <Gallery ref={ref} data={imageList} keyExtractor={keyExtractor} renderItem={renderItem} initialIndex={initialIndex} onIndexChange={onIndexChange} customTransition={transition} />
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  counter: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
