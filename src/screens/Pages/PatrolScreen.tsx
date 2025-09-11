import {api} from '@/api/request';
import {RootStackParamList} from '@/navigation/types';
import {useAuthStore} from '@/stores/auth';
import {useProject} from '@/stores/userProject';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {SecurityMemberType} from './type';
type Props = NativeStackScreenProps<RootStackParamList>;
export const PatrolScreen = ({navigation}: Props) => {
  // const {tokenInfo} = useAuthStore();
  const {myProject} = useProject();
  const [data, setData] = useState<SecurityMemberType[]>();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    onRefresh();
  }, [myProject]);

  const patrolPoint = async () => {
    setRefreshing(true);
    const resp = await api.get<SecurityMemberType[]>('/wechat/patrolPoint/securityteammember', {projectId: myProject?.snowFlakeId});
    console.log('队员的巡逻点列表:', resp);
    setData(resp.data);
    setRefreshing(false);
  };

  async function getPatrolPoint() {
    await api.get('/wechat/patrolPoint/getPatrolPoint');
  }
  // 下拉刷新
  const onRefresh = useCallback(() => {
    patrolPoint();
  }, []);

  const renderItem = ({item}: {item: SecurityMemberType}) => (
    <View style={styles.itemBox}>
      <View>
        <Text style={{fontSize: 22}}>{item.name}</Text>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PatrolDetails', {id: item.snowFlakeId, type: 2});
          }}
        >
          <View style={[styles.submitBtn, {backgroundColor: '#2080F0', width: 80}]}>
            <Text style={styles.submitBtnText}>详情</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PatrolDetails', {id: item.snowFlakeId, type: 1});
          }}
        >
          <View style={[styles.submitBtn, {backgroundColor: '#00c48f', width: 120, marginLeft: 12}]}>
            <Text style={styles.submitBtnText}>巡逻打卡</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.snowFlakeId}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2080F0']} tintColor='#2080F0' />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={async () => {
          // navigation.navigate('FaceRecognitionPunch');
        }}
      >
        <Text style={styles.fabText}>扫码</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9fb'},

  itemBox: {
    backgroundColor: '#fff',

    padding: 16,
    borderRadius: 6,
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,

    // iOS 阴影
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Android 阴影
    elevation: 1,
  },

  fab: {
    position: 'absolute',
    right: 10,
    bottom: 50,
    width: 120,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#2080F0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, // 安卓阴影
  },

  fabText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  submitBtn: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  submitBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
});
