import {ActivityIndicator, Dimensions, Image, NativeModules, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TopMessage} from '../components/TopMessage';
import {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import Ionicons from '@react-native-vector-icons/ionicons';
import Video from 'react-native-video';
import {takeMediaUpload} from '@/components/TakeMedia';
import LoadingOverlay from '@/components/LoadingOverlay';
import {api} from '@/api/request';
import {useProject} from '@/stores/userProject';
import {StackActions} from '@react-navigation/native';
import CustomInput from '@/components/CustomInput';
import {ConfirmAlert} from '@/components/ConfirmDialog/ConfirmDialogProvider';

const {width} = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'PatrolDetails'>;
export const PatrolDetails = ({route, navigation}: Props) => {
  // console.log('是否扫码页跳转过来', route.params.isScan);
  // console.log('巡逻点id', route.params.id);

  const pageType = route.params.type;
  const {myProject} = useProject();
  const [center, setCenter] = useState<{
    latitude: number;
    longitude: number;
  }>();

  const {MyAmapLocation} = NativeModules;
  async function fetchLocation() {
    try {
      const loc = await MyAmapLocation.startLocation();
      console.log('高德定位结果:', loc);
      setCenter({latitude: loc.latitude, longitude: loc.longitude});
    } catch (e) {
      console.error('高德定位失败:', e);
    }
  }
  useEffect(() => {
    fetchLocation();
  }, []);

  const [imgList, setImgList] = useState<string[]>([]);
  const [imgKeyList, setImgKeyList] = useState<string[]>([]);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('照片上传中...');
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  async function handleSubmit() {
    console.log('经纬度  center', center);
    if (!center) {
      ConfirmAlert.alert('提示', '未能获取到当前位置', [{text: '确定', onPress: () => {}}]);
      return;
    }

    const patrolPointSignParams = {
      projectId: myProject?.snowFlakeId,
      projectPatrolPointId: route.params.id,
      location: [center.longitude, center.latitude],
      imgList: imgKeyList,
      video: videoKey,
      remark: remark,
    };
    console.log('🍎 ~ handleSubmit ~ patrolPointSignParams:提交参数', patrolPointSignParams);

    try {
      setLoading(true);
      const res = await api.post('/wechat/patrolPoint/sign', patrolPointSignParams);
      console.log('🍎 ~提交 handleSubmit ~ res:', res);

      ConfirmAlert.alert('提示', res.message, [
        {
          text: '确定',
          onPress: () => {
            navigation.dispatch(StackActions.pop(1));
          },
        },
      ]);
    } catch (error) {
      // @ts-ignore
      ConfirmAlert.alert('提示', error?.message, [{text: '确定', onPress: () => {}}]);
    } finally {
      setLoading(false);
    }
  }
  const removePhoto = (index: number) => {
    setImgList(prev => prev.filter((_, i) => i !== index));
  };

  const takeVideo = async () => {
    try {
      setTitle('视频上传中...');
      setActivityLoading(true);
      const res = await takeMediaUpload('video', 'your-parent-dir');
      setVideoUri(res.previewUrl);
      setVideoKey(res.objectKey);
    } catch (error) {
      if (error instanceof Error) {
        ConfirmAlert.alert('提示', error.message, [{text: '确定', onPress: () => {}}]);
      } else {
        ConfirmAlert.alert('提示', String(error), [{text: '确定', onPress: () => {}}]);
      }
    } finally {
      setActivityLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setTitle('照片上传中...');
      setActivityLoading(true);
      const res = await takeMediaUpload('photo', 'your-parent-dir');
      setImgList(prev => [...prev, res.previewUrl]);
      setImgKeyList(prev => [...prev, res.objectKey]);
    } catch (error) {
      if (error instanceof Error) {
        ConfirmAlert.alert('提示', error.message, [{text: '确定', onPress: () => {}}]);
      } else {
        ConfirmAlert.alert('提示', String(error), [{text: '确定', onPress: () => {}}]);
      }
    } finally {
      setActivityLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1, backgroundColor: '#ccc'}}>
        <TopMessage id={route.params.id} type={pageType} />

        {pageType === 1 && (
          <View style={{backgroundColor: '#fff'}}>
            <View style={styles.center}>
              {/* 上传照片： */}
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Text style={styles.bigText}>上传照片：</Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    takePhoto();
                  }}
                  style={styles.upLoadStyle}
                >
                  <Ionicons name={'camera'} size={50} color={'#aaa'} />
                </TouchableOpacity>
              </View>

              {/* 照片列表 */}
              {imgList.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false} // 隐藏横向滚动条，可选
                  contentContainerStyle={{padding: 10}} // 内容样式，可选
                >
                  {imgList.map((uri, index) => (
                    <TouchableOpacity
                      key={index}
                      onLongPress={() => {
                        ConfirmAlert.alert('删除确认', '确定要删除这张图片吗？?', [
                          {text: '取消', style: 'cancel', onPress: () => {}},
                          {text: '确定', onPress: () => removePhoto(index)},
                        ]);
                      }}
                      delayLongPress={1000} // 长按 2 秒触发
                    >
                      <Image source={{uri}} style={styles.preview} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {/* 视频： */}
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Text style={styles.bigText}>视频：</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    takeVideo();
                  }}
                  style={styles.upLoadStyle}
                >
                  <Ionicons name={'videocam-outline'} size={50} color={'#aaa'} />
                </TouchableOpacity>
              </View>
              <View>
                {videoUri && (
                  <Video
                    source={{uri: videoUri}}
                    style={{width: 150, height: 100}}
                    controls={true} // 显示播放控制条
                    resizeMode='contain'
                  />
                )}
              </View>

              <View>
                <Text style={styles.bigText}>备注：</Text>
                <CustomInput height={80} value={remark} onChangeText={setRemark} placeholder='请输入备注' />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {pageType === 1 && (
        <TouchableOpacity onPress={handleSubmit}>
          <View style={styles.submitBtn}>{loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.submitBtnText}>确认打卡</Text>}</View>
        </TouchableOpacity>
      )}

      <LoadingOverlay visible={activityLoading} title={title} />
    </View>
  );
};

const styles = StyleSheet.create({
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

  center: {
    backgroundColor: '#fff',
    padding: 8,
    marginTop: 10,
  },
  bigText: {
    width: 120,
    fontSize: 22,
  },
  upLoadStyle: {
    height: 100,
    width: 100,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#aaa',
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedHeight: {
    height: 100,
    backgroundColor: '#fff',
  },
  preview: {
    height: 100,
    width: 100,
    marginLeft: 10,
    borderRadius: 10,
  },
});
