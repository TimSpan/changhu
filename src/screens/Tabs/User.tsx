import {useAuthStore} from '@/stores/auth';
import {useProject} from '@/stores/userProject';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Button as NButton, Divider} from 'react-native-paper';
import {ConfirmAlert} from '@/components/ConfirmDialog/ConfirmDialogProvider';
import {SafeAreaView} from 'react-native-safe-area-context';
export const User = ({navigation}: any) => {
  const {clearMyProject} = useProject();
  const {tokenInfo, clearTokenInfo} = useAuthStore();
  const logOut = () => {
    clearTokenInfo();
    clearMyProject();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground source={require('../../assets/banner.png')} style={styles.header}>
        <View style={styles.userInfo}>
          <View style={{marginLeft: 12}}>
            <Text style={styles.name}>{tokenInfo?.role === 'SECURITY' ? '保安队员' : '队长 '}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.role}>保安部门</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={{lineHeight: 50, fontSize: 18}}>意见收集</Text>
        <Divider />
        <Text style={{lineHeight: 50, fontSize: 18}}>关于App</Text>
        <Divider />
        <NButton
          style={{
            borderRadius: 0,
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: '#2080F0',
          }}
          mode='contained'
          onPress={() => {
            ConfirmAlert.alert('提示', '确定要退出登录么?', [
              {text: '取消', style: 'cancel', onPress: () => {}},
              {text: '确定', onPress: () => logOut()},
            ]);
          }}
        >
          <Text style={{fontSize: 20}}>退出登录</Text>
        </NButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {
    height: 150,
    justifyContent: 'center',

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
  role: {fontSize: 16, color: '#eee', marginTop: 4},
  content: {flex: 1, paddingLeft: 16, paddingRight: 16},
  sectionTitle: {fontSize: 16, fontWeight: '500', marginBottom: 12},
});
