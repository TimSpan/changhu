import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../api/request';
import { useState } from 'react';

export default function TestScreen({ route, navigation }: any) {
  console.log('✅ 从 route.params 拿到参数', route.params);
  // ✅ 从 route.params 拿到参数

  const [enums, setEnums] = useState();
  return (
    <View style={styles.container}>
      <Button
        title="测试接口"
        onPress={async () => {
          const res = await api.get('/common/enums');
          setEnums(res.data);
          console.log('_________________________ ~ TestScreen ~ res:', res);
        }}
      />
      <Button
        title="测试接口"
        onPress={async () => {
          try {
            const res = await api.get('/dataOptions/roleList');
            setEnums(res.data);
            console.log('_________________________ ~ TestScreen ~ res:', res);
          } catch (error) {
            console.error('_________________________ ~ error:', error);
          }
        }}
      />

      <View style={styles.h}>
        <ScrollView>
          <Text>{JSON.stringify(enums)}</Text>
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  preview: { width: 200, height: 200, marginTop: 20 },
  h: {
    height: 300,
  },
});
