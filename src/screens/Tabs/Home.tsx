import {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {Alert, PermissionsAndroid, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import WebView from 'react-native-webview';
export const Home = () => {
  // 116.389823,39.909365
  // const center = {
  //   latitude: 28.237204,
  //   longitude: 112.814658,
  // };
  const [center, setCenter] = useState<{
    latitude: number;
    longitude: number;
  }>();
  // Android 动态请求定位权限
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const fine = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      const coarse = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
      return fine === PermissionsAndroid.RESULTS.GRANTED && coarse === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    (async () => {
      const ok = await requestLocationPermission();
      console.log('系统定位权限ok?', ok);
      if (!ok) return;
      try {
        Geolocation.getCurrentPosition(info => {
          console.log(info);
          const {latitude, longitude} = info.coords;
          setCenter({latitude, longitude});
        });
      } catch (error) {
        console.error('_________________________ ~ Home ~ error:', error);
      }

      // Geolocation.getCurrentPosition(
      //   pos => {
      //     console.log('定位成功', pos);
      //   },
      //   err => console.log('定位失败', err),
      //   {
      //     enableHighAccuracy: true,
      //     timeout: 20000,
      //     maximumAge: 5000,
      //   },
      // );
    })();
  }, []);

  const polygonCoords = [
    {longitude: 112.814658, latitude: 28.239131},
    {longitude: 112.814313, latitude: 28.237204},
    {longitude: 112.814613, latitude: 28.23492},
    {longitude: 112.816527, latitude: 28.235544},
    {longitude: 112.817205, latitude: 28.236416},
    {longitude: 112.818551, latitude: 28.236671},
    {longitude: 112.819575, latitude: 28.238239},
  ];
  const [time, setTime] = useState(dayjs().format('HH:mm'));
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format('HH:mm'));
    }, 1000 * 60); // 每分钟更新一次
    return () => clearInterval(interval);
  }, []);

  const webRef = useRef<WebView>(null);
  return (
    <>
      <StatusBar backgroundColor='#ccc' />

      <View style={styles.container}>
        <View style={styles.top}>
          <WebView
            ref={webRef}
            source={{uri: 'file:///android_asset/amap.html'}}
            originWhitelist={['*']}
            javaScriptEnabled
            onMessage={event => {
              console.log('WebView 发回消息', event.nativeEvent.data);
              console.log(center);

              // 需要 webview 先加载好、 RN再发过去
              if (center) {
                console.log('_________________________ ~ center:', center);
                webRef.current?.postMessage(JSON.stringify(center));
                console.log('执行了发送消息  RN ➡ H5');
              } else {
                webRef.current?.postMessage(JSON.stringify({latitude: 28.237204, longitude: 112.814658}));
                console.log('执行了发送消息  RN ➡ H5');
              }
            }}
          />
        </View>
        {/* source={{uri: 'file:///android_asset/amap.html'}} // Android 本地 */}

        <View style={styles.bottom}>
          <View style={styles.clockButtonBox}>
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient colors={['#f7853f', '#fba426', '#ffce11']} start={{x: 0, y: 0}} end={{x: 0, y: 1}} style={styles.clockButtonBox}>
                <Text style={styles.timeText}>{time}</Text>
                <Text style={styles.buttonText}>打卡</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <ScrollView style={{flex: 1}}></ScrollView>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    // backgroundColor: '#ccc',
  },
  top: {
    flex: 2,
  },
  bottom: {
    flex: 1,
    display: 'flex',
    alignItems: 'center', // 水平居中
  },
  clockButtonBox: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timeText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  SafeAreaView: {flex: 1, backgroundColor: '#007bff'},
});
