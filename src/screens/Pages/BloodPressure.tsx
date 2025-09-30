// 此页面已 暂停使用、暂时废弃
import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Camera} from 'react-native-vision-camera';

interface Item {
  id: number;
  name: string;
  desc: string;
}

export const BloodPressure = ({navigation}: any) => {
  const [data, setData] = useState<Item[]>(() =>
    Array.from({length: 10}, (_, i) => ({
      id: i + 1,
      name: `张三${i + 1}`,
      desc: `假数据 ${i + 1}`,
    })),
  );

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData(prev =>
        Array.from({length: 10}, (_, i) => ({
          id: i + 1,
          name: `张三${i + 1}`,
          desc: `假数据 ${i + 1}`,
        })),
      );
      setRefreshing(false);
    }, 1000);
  }, []);

  // 上拉加载更多
  const loadMore = useCallback(() => {
    if (loadingMore) return;
    if (data.length >= 50) return; // 不超过 50 条

    setLoadingMore(true);
    setTimeout(() => {
      setData(prev => {
        const start = prev.length + 1;
        const more = Array.from({length: 10}, (_, i) => ({
          id: start + i,
          name: `张三${start + i}`,
          desc: `假数据 ${start + i}`,
        }));
        return [...prev, ...more].slice(0, 50); // 保证最多 50
      });
      setLoadingMore(false);
    }, 2000);
  }, [data, loadingMore]);

  const renderItem = ({item}: {item: Item}) => (
    <View style={styles.itemBox}>
      <View>
        <Text style={{fontSize: 16}}>{item.name}</Text>
        <Text>{item.desc}</Text>
      </View>
      <TouchableOpacity>
        <Text style={{color: '#2080F0'}}>详情</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        // contentContainerStyle={{gap: 12}}

        // RefreshControl 文档地址： https://reactnative.cn/docs/refreshcontrol
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2080F0']} // 安卓: 转圈圈颜色数组
            tintColor='#2080F0' // iOS: 转圈圈颜色
            // size={RefreshControl.SIZE.LARGE}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? <Text style={{textAlign: 'center', padding: 16}}>加载中...</Text> : data.length >= 50 ? <Text style={{textAlign: 'center', padding: 16}}>没有更多数据了</Text> : null
        }
      />

      {/* 悬浮按钮 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={async () => {
          const permission = await Camera.requestCameraPermission();

          navigation.navigate('FaceRecognitionPunch');
          // navigation.navigate('BloodForm');
        }}
      >
        <Text style={styles.fabText}>血压检测</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9fb'},

  itemBox: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
