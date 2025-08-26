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
import {Toast as UseToast} from '@/components/Toast';

export default function Example() {
  const [toast, setToast] = useState('');

  const setToken = useAuthStore(state => state.setToken);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: '18570083528',
    password: '123456',
  });
  const [errors, setErrors] = useState({phoneNumber: '', password: ''});

  const validate = () => {
    let valid = true;
    let newErrors = {phoneNumber: '', password: ''};

    // 手机号校验（简单示例：11位数字）
    if (!form.phoneNumber) {
      newErrors.phoneNumber = '请输入手机号';
      valid = false;
    } else if (!/^1[3-9]\d{9}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = '手机号格式不正确';
      valid = false;
    }

    // 密码校验（长度 >= 6）
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
        const res = await api.post<TokenInfo>('/login/management', {
          phoneNumber: form.phoneNumber,
          password: encryptedText,
        });
        console.log('_________________________ ~ login ~ res:', res);
        // setTimeout(() => {
        setToken(res.data.tokenValue, res.data.tokenName);
        // }, 2000);
      } catch (error) {
        console.error('_________________________ ~ login ~ error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Alert.alert('校验失败');
      // UseToast('校验失败！');
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
            style={{marginBottom: 36, marginTop: 36, alignSelf: 'center'}}
          />

          <Text style={styles.title}>
            欢迎登录<Text style={{color: '#075eec'}}>隆吉安保</Text>
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
              onChangeText={phoneNumber => setForm({...form, phoneNumber})}
              placeholder="请输入手机号"
              placeholderTextColor="#6b7280"
              value={form.phoneNumber}
              style={[
                styles.inputControl,
                errors.phoneNumber ? {borderColor: 'red'} : null,
              ]}
            />
            {errors.phoneNumber ? (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
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
                errors.phoneNumber ? {borderColor: 'red'} : null,
              ]}
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={login}>
              <View style={styles.btn}>
                {/* <Text style={styles.btnText}>登录</Text> */}
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>登录</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity onPress={() => {}}>
            <Text style={styles.formLink}>忘记密码</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.formFooter}>
          <Text style={{textDecorationLine: 'underline'}}>
            湖南长沪信息科技有限公司
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
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
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
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
    color: '#075eec',
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
    backgroundColor: '#075eec',
    borderColor: '#075eec',
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

// // src/screens/Login.tsx
// import React, { useState } from 'react';
// import { View, TextInput } from 'react-native';
// import { Input, Button } from '@rneui/themed';
// import { useAuthStore } from '@/stores/auth';
// import axios from '@/api/request';
// import { encryptStr } from '@/utils';

// export default function LoginScreen() {
//   const [phoneNumber, setPhoneNumber] = useState('18570083528');
//   const [password, setPassword] = useState('123456');
//   const setToken = useAuthStore(state => state.setToken);
//   const [loading, setLoading] = useState(false);

//   const login = async () => {
//     setLoading(true);

//     const encryptedText = encryptStr(password);

//     try {
//       const res = await axios.post<TokenInfo>('/login/management', {
//         phoneNumber: phoneNumber,
//         password: encryptedText,
//       });
//       console.log('_________________________ ~ login ~ res:', res);

//       setToken(res.data.tokenValue, res.data.tokenName);
//     } catch (error) {
//       console.error('_________________________ ~ login ~ error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
//       <Input
//         onChangeText={setPhoneNumber}
//         value={phoneNumber}
//         placeholder="请输入账户"
//       />
//       <Input
//         onChangeText={setPassword}
//         value={password}
//         placeholder="请输入密码"
//         secureTextEntry={true}
//       />

//       <Button loading={loading} title="登录" onPress={login} />
//     </View>
//   );
// }
