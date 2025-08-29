import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {CustomIcon} from '@/components/CustomIcon/index';
import {encryptStr} from '@/utils';
import {api} from '@/api/request';
import {useAuthStore} from '@/stores/auth';
import {useProject} from '@/stores/userProject';
import {Toast as UseToast} from '@/components/Toast';
import {AxiosError} from 'axios';
export default function Login() {
  const [toast, setToast] = useState('');
  const {setMyProject} = useProject();
  const setToken = useAuthStore(state => state.setToken);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tel: '17346625362',
    // tel: '18711712226',
    password: '123456',
  });
  const [errors, setErrors] = useState({tel: '', password: ''});
  const validate = () => {
    let valid = true;
    let newErrors = {tel: '', password: ''};
    if (!form.tel) {
      newErrors.tel = '请输入手机号';
      valid = false;
    } else if (!/^1[3-9]\d{9}$/.test(form.tel)) {
      newErrors.tel = '手机号格式不正确';
      valid = false;
    }
    if (!form.password) {
      newErrors.password = '请输入密码';
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = '密码长度至少6位';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };
  const login = async () => {
    if (validate()) {
      setLoading(true);
      const encryptedText = encryptStr(form.password);
      try {
        const res = await api.post<TokenMessage>('/login/handDevice', {
          tel: form.tel,
          password: encryptedText,
        });
        console.log('🍎 ~ login ~ res:', res);
        if (res) {
          setToken(res.data.tokenInfo.tokenValue, res.data.tokenInfo.tokenName);
        }

        const result = await api.get<MyProject>('/wechat/common/getMyProject');
        console.log('🍎 ~ login ~ result:', result);
        if (result) {
          setMyProject(result.data);
        }
      } catch (error) {
        const err = error as AxiosError<JsonResult<any>>;
        console.log('🍎 ~ login ~ error:', error);
        Alert.alert('提示', err.message);
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: '提示',
        text2: '校验失败',
      });
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#e8ecf4'}}>
      {toast ? <UseToast message={toast} onClose={() => setToast('')} /> : null}
      <View style={styles.container}>
        <View style={styles.header}>
          <CustomIcon
            width={80}
            height={80}
            style={{marginBottom: 15, marginTop: 15, alignSelf: 'center'}}
          />

          <Text style={styles.title}>
            欢迎登录<Text style={{color: '#2080F0'}}>隆吉安保</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>账号</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="name-phone-pad"
              onChangeText={tel => setForm({...form, tel})}
              placeholder="请输入手机号"
              placeholderTextColor="#6b7280"
              value={form.tel}
              style={[
                styles.inputControl,
                errors.tel ? {borderColor: 'red'} : null,
              ]}
            />
            {errors.tel ? (
              <Text style={styles.errorText}>{errors.tel}</Text>
            ) : null}
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>密码</Text>

            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={password => setForm({...form, password})}
              placeholder="请输入密码"
              placeholderTextColor="#6b7280"
              secureTextEntry={true}
              value={form.password}
              style={[
                styles.inputControl,
                errors.tel ? {borderColor: 'red'} : null,
              ]}
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={login}>
              <View style={styles.btn}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>登录</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    // marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    // marginBottom: 36,
  },
  /** Form */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2080F0',
    textAlign: 'center',
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#2080F0',
    borderColor: '#2080F0',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  errorText: {
    marginTop: 4,
    color: 'red',
    fontSize: 12,
  },
});
