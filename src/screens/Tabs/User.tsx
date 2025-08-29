import ConfirmDialog from '@/components/ConfirmDialog';
import {useAuthStore} from '@/stores/auth';
import {useState} from 'react';
import {useProject} from '@/stores/userProject';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button as NButton, Divider} from 'react-native-paper';

export const User = () => {
  const {clearMyProject} = useProject();
  const {logout} = useAuthStore();

  const logOut = () => {
    try {
      logout();
      clearMyProject();
    } catch (error) {
      console.log('_________________________ ~ logout ~ error:', error);
    }
  };
  const [visible, setVisible] = useState(false);
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* 上半部分：背景图 + 用户信息 */}
        <ImageBackground
          source={require('../../assets/banner.png')} // 本地图片路径
          style={styles.header}
          // imageStyle={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}
        >
          <View style={styles.userInfo}>
            <Image
              source={{uri: 'https://i.pravatar.cc/100'}} // 头像
              style={styles.avatar}
            />
            <View style={{marginLeft: 12}}>
              <Text style={styles.name}>队长</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.role}>保安部门</Text>
                <Text style={[styles.role, {marginLeft: 20}]}>未选择单位</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* 下半部分：其他功能列表 */}
        <View style={styles.content}>
          {/* 这里可以放 List / Button / Icon 等 */}
          <Text style={{lineHeight: 50}}>修改用户信息</Text>
          <Divider />
          <Text style={{lineHeight: 50}}>意见收集</Text>
          <Divider />
          <Text style={{lineHeight: 50}}>关于App</Text>
          <Divider />
          <NButton
            style={{
              borderRadius: 0,
              marginTop: 5,
              marginBottom: 5,
              backgroundColor: '#2080F0',
            }}
            mode="contained"
            onPress={() => {
              setVisible(true);
            }}>
            退出登录
          </NButton>
        </View>

        <ConfirmDialog
          visible={visible}
          title="提示"
          text="确定要退出登录么？"
          confirm={() => {
            setVisible(false);
            logOut();
          }}
          close={() => {
            setVisible(false);
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {
    height: 150,
    justifyContent: 'flex-end',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 8,
    borderRadius: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {fontSize: 20, fontWeight: '600', color: '#fff'},
  role: {fontSize: 14, color: '#eee', marginTop: 4},
  content: {flex: 1, paddingLeft: 16, paddingRight: 16},
  sectionTitle: {fontSize: 16, fontWeight: '500', marginBottom: 12},
});
