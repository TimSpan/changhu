// src/screens/VideoScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { launchCamera } from 'react-native-image-picker';

export default function VideoScreen({ route, navigation }: any) {
  const [videoUri, setVideoUri] = React.useState<string | null>(null);

  const recordVideo = () => {
    launchCamera({ mediaType: 'video', saveToPhotos: true }, response => {
      if (response.assets && response.assets[0].uri) {
        setVideoUri(response.assets[0].uri);
        if (route.params?.setVideoUri) {
          route.params.setVideoUri(response.assets[0].uri);
        }
        navigation.goBack();
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="点击录像" onPress={recordVideo} />
      {videoUri && <Text style={{ marginTop: 20 }}>视频地址: {videoUri}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
