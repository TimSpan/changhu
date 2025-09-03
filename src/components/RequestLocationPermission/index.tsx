import {PermissionsAndroid, Platform} from 'react-native';

export default async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: '定位权限申请',
        message: '需要获取您的位置来显示地图定位',
        buttonNeutral: '稍后再问',
        buttonNegative: '拒绝',
        buttonPositive: '同意',
      });
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
}
