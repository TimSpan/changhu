import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AntDesign} from '@react-native-vector-icons/ant-design';
import {Divider} from 'react-native-paper';
import {RootStackParamList} from '@/navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export const Center = ({navigation}: Props) => {
  return (
    <View>
      <View style={{padding: 16}}>
        <Text
          style={{
            lineHeight: 30,
            fontSize: 20,
            color: '#2080F0',
          }}
        >
          快捷功能
        </Text>
        <Divider style={{marginTop: 10, marginBottom: 20}} />
        <View style={{flexDirection: 'row'}}>
          <View style={{alignItems: 'center', flex: 1}}>
            <AntDesign name={'safety-certificate'} size={26} color={'#2080F0'} />
            <Text style={{fontSize: 16}}>巡逻</Text>
          </View>

          <TouchableOpacity
            style={{alignItems: 'center', flex: 1}}
            activeOpacity={0.7} // 点击时的透明度反馈
            onPress={() => {
              navigation.navigate('Report');
            }}
          >
            <AntDesign name='alert' size={26} color='#2080F0' />
            <Text style={{fontSize: 16}}>事件上报</Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center', flex: 1}}></View>
        </View>
      </View>

      <View style={{padding: 16}}>
        <Text
          style={{
            lineHeight: 30,
            fontSize: 20,
            color: '#2080F0',
          }}
        >
          功能
        </Text>
        <Divider style={{marginTop: 10, marginBottom: 20}} />
        <View style={{flexDirection: 'row'}}>
          {/* <View style={{alignItems: 'center', flex: 1}}>
            <AntDesign name={'ordered-list'} size={26} color={'#2080F0'} />
            <Text style={{fontSize: 16}}>排班</Text>
          </View> */}

          <TouchableOpacity
            style={{alignItems: 'center', flex: 1}}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('BloodPressure');
            }}
          >
            <AntDesign name={'thunderbolt'} size={26} color={'#2080F0'} />
            <Text style={{fontSize: 16}}>采集血压</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{alignItems: 'center', flex: 1}}
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('Test');
            }}
          >
            <AntDesign name={'thunderbolt'} size={26} color={'#2080F0'} />
            <Text style={{fontSize: 16}}>测试</Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center', flex: 1}}>
            {/* <AntDesign name={'solution'} size={26} color={'#2080F0'} />
            <Text style={{fontSize: 16}}>岗位管理</Text> */}
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 24}}>
          {/* <View style={{alignItems: 'center', flex: 1}}>
            <AntDesign name={'unordered-list'} size={26} color={'#2080F0'} />
            <Text style={{fontSize: 16}}>班次管理</Text>
          </View> */}

          <View style={{alignItems: 'center', flex: 1}}>
            {/* <AntDesign name={'video-camera'} size={26} color={'#2080F0'} />
            <Text style={{fontSize: 16}}>巡逻管理</Text> */}
          </View>

          <View style={{alignItems: 'center', flex: 1}}></View>
          <View style={{alignItems: 'center', flex: 1}}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ccc'},
});
