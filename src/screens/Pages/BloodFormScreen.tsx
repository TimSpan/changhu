import {useSkipBack} from '@/hooks/useSkipBack';
import {Text, View, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Image} from 'react-native';
import {TextInput as TextInputPaper, Button as NButton} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {useState} from 'react';
import {useProject} from '@/stores/userProject';
import Ionicons from '@react-native-vector-icons/ionicons';
import LoadingOverlay from '@/components/LoadingOverlay';
const {width} = Dimensions.get('window');
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@/navigation/types';
import {takeMediaUpload} from '@/components/TakeMedia';
import {ImageLibraryOptions, launchImageLibrary} from 'react-native-image-picker';
import DialogWithRadioBtns from '@/components/DialogWithRadioBtns';
type Props = NativeStackScreenProps<RootStackParamList, 'BloodForm'>;
export function BloodFormScreen({route, navigation}: Props) {
  console.log('route.params', route.params);
  useSkipBack<RootStackParamList>(2, 'BloodForm');
  const {myProject} = useProject();

  const [visible, setVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('照片上传中...');

  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [face, setFace] = useState<string>();
  const [confirmAction, setConfirmAction] = useState<((val?: string) => void) | null>(null);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      high: '',
      low: '',
      heartbeat: '',
      face: '',
      signature: '',
      remark: '',
    },
  });
  const onSubmit = (data: any) => {
    if (data) {
      console.log('🍎 ~ onSubmit ~ data:', data);
    } else {
      Alert.alert('提示', '表单未填写完成');
    }
  };
  const takePhoto = async (onChange: (val: string) => void) => {
    try {
      setTitle('照片上传中...');
      setActivityLoading(true);
      const res = await takeMediaUpload('photo', 'your-parent-dir');
      setFace(res.previewUrl);
      onChange(res.objectKey);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('提示', error.message);
      } else {
        Alert.alert('提示', String(error));
      }
    } finally {
      setActivityLoading(false);
    }
  };

  const pickImage = async (onChange: (val: string) => void) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo', // 只选照片
      selectionLimit: 1, // 限制只能选一张
      quality: 1, // 图片质量（0-1）
    };

    launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log('用户取消选择');
      } else if (res.errorCode) {
        Alert.alert('错误', res.errorMessage || '选择失败');
      } else if (res.assets && res.assets.length > 0) {
        console.log('🍎 ~ pickImage ~ res:', res);
      }
    });
  };
  function switchType(onChange: (val: string) => void) {
    setVisible(true);

    setConfirmAction(() => (val?: string) => {
      console.log('🍎 ~ switchType ~ val:', val);
      if (!val) return;
      const actions: Record<string, () => void> = {
        '1': () => takePhoto(onChange),
        '2': () => pickImage(onChange),
      };

      actions[val]?.();
    });
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1, margin: 10}}>
        {/* 上传照片 */}
        <Controller
          name='face'
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text style={{color: '#FF0000'}}>*</Text>
              <Text style={styles.bigText}>上传照片</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  // takePhoto(onChange);
                  // pickImage();
                  switchType(onChange);
                }}
                style={styles.upLoadStyle}
              >
                <Ionicons name={'camera'} size={50} color={'#aaa'} />
              </TouchableOpacity>

              {face && (
                <TouchableOpacity
                  onLongPress={() => {
                    Alert.alert(
                      '删除确认',
                      '确定要删除这张图片吗？',
                      [
                        {text: '取消', style: 'cancel'},
                        {
                          text: '删除',
                          style: 'destructive',
                          onPress: () => {
                            onChange('');
                          },
                        },
                      ],
                      {cancelable: true},
                    );
                  }}
                  delayLongPress={1000}
                >
                  <Image source={{uri: face}} style={styles.preview} />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        {errors.face && <Text style={styles.errorText}>请上传照片</Text>}
        {/* 血压高 */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#FF0000'}}>*</Text>
              <TextInputPaper mode='outlined' style={styles.inputContainerStyle} dense label='血压高' placeholder='请输入血压高' value={value} onChangeText={onChange} />
            </View>
          )}
          name='high'
        />
        {errors.high && <Text style={styles.errorText}>请输入血压高</Text>}
        {/* 血压低 */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#FF0000'}}>*</Text>
              <TextInputPaper mode='outlined' style={styles.inputContainerStyle} dense label='血压低' placeholder='请输入血压低' value={value} onChangeText={onChange} />
            </View>
          )}
          name='low'
        />
        {errors.low && <Text style={styles.errorText}>请输入血压低</Text>}

        {/* 心跳 */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#FF0000'}}>*</Text>
              <TextInputPaper mode='outlined' style={styles.inputContainerStyle} dense label='每分钟心跳' placeholder='请输入每分钟心跳' value={value} onChangeText={onChange} />
            </View>
          )}
          name='heartbeat'
        />
        {errors.heartbeat && <Text style={styles.errorText}>请输入每分钟心跳</Text>}

        {/* 签名 */}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#FF0000'}}>*</Text>
              <NButton
                style={{
                  borderRadius: 0,
                  marginTop: 5,
                  marginBottom: 5,
                  backgroundColor: '#2080F0',
                }}
                mode='contained'
                onPress={() => {
                  navigation.navigate('Test');
                }}
              >
                去签名
              </NButton>
            </View>
          )}
          name='signature'
        />
        {errors.signature && <Text style={styles.errorText}>请签名</Text>}

        {/* 备注 */}
        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#FF0000'}}>*</Text>
              <TextInputPaper mode='outlined' multiline style={styles.fixedHeight} dense label='备注' placeholder='请输入备注' value={value} onChangeText={onChange} />
            </View>
          )}
          name='remark'
        />
        {errors.remark && <Text style={styles.errorText}>请输入备注</Text>}
        <LoadingOverlay visible={activityLoading} title={title} />
      </ScrollView>

      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <View style={styles.submitBtn}>{loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.submitBtnText}>确认</Text>}</View>
      </TouchableOpacity>
      <DialogWithRadioBtns
        data={[
          {
            label: '拍照',
            value: '1',
          },
          {
            label: '相册',
            value: '2',
          },
        ]}
        visible={visible}
        close={function () {
          setVisible(false);
        }}
        confirm={function (val) {
          console.log('🍎 ~ function ~ val:', val);
          confirmAction?.(val);
          setVisible(false);
        }}
      ></DialogWithRadioBtns>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainerStyle: {
    margin: 8,
    width: 310,
  },
  errorText: {
    color: '#FF0000',
  },

  submitBtn: {
    height: 50,
    width: width,
    backgroundColor: '#2080F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitBtnText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  fixedHeight: {
    margin: 8,
    width: 310,
    height: 80,
    backgroundColor: '#fff',
  },
  bigText: {
    width: 100,
    fontSize: 22,
  },

  upLoadStyle: {
    height: 100,
    width: 100,
    backgroundColor: '#fafafa',
    borderWidth: 1, // 边框宽度
    borderColor: '#aaa', // 边框颜色
    borderStyle: 'dashed', // 边框样式：'solid' | 'dashed' | 'dotted'
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  preview: {
    height: 100,
    width: 100,
    marginLeft: 10,
    borderRadius: 10,
  },
});
