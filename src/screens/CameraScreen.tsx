// src/screens/CameraScreen.tsx
import React from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';


type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;
export default function CameraScreen({ route, navigation }: Props) {
  const [photoUri, setPhotoUri] = React.useState<string | null>(null);
  //  const { setPhotoUri } = route.params;
  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, response => {
      if (response.assets && response.assets[0].uri) {
        setPhotoUri(response.assets[0].uri);
        if (route.params?.setPhotoUri) {
          route.params.setPhotoUri(response.assets[0].uri);
        }
        navigation.goBack();
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="点击拍照" onPress={takePhoto} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  preview: { width: 200, height: 200, marginTop: 20 },
});
