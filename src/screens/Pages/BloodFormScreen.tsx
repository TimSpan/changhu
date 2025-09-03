import {useSkipBack} from '@/hooks/useSkipBack';
import {Text, View} from 'react-native';
import type {RootStackParamList} from '@/navigation/types';
export function BloodFormScreen() {
  useSkipBack<RootStackParamList>(2, 'BloodForm');
  return (
    <View>
      <Text>采集上传</Text>
    </View>
  );
}
