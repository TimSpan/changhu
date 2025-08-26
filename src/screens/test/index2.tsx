import {StyleSheet, View} from 'react-native';

export function Index2({route, navigation}: any) {
  return <View style={styles.container}></View>;
}
const styles = StyleSheet.create({
  container: {flex: 1},
  preview: {width: 200, height: 200, marginTop: 20},
  h: {
    height: 300,
  },
});
