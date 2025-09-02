import {api} from '@/api/request';
import {useEffect, useState} from 'react';
import {launchCamera} from 'react-native-image-picker';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import Video from 'react-native-video';
import {useProject} from '@/stores/userProject';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import EventTypeBottomSheet from '@/components/EventTypeBottomSheet';
import {
  generateFileName,
  getPreSignedUrl,
  getPreSignedUrlFromKey,
} from '@/utils/upload';
import LoadingOverlay from '@/components/LoadingOverlay';
const {width} = Dimensions.get('window');
export const ReportScreen = () => {
  const {myProject} = useProject();
  const [remark, setRemark] = useState('');

  const [title, setTitle] = useState<string>('照片上传中...');
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<Option | null>(null);
  const [eventTypeList, setEventTypeList] = useState<Option[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [imgList, setImgList] = useState<string[]>([]);
  const [objectKey, setObjectKey] = useState<string[]>([]);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoObjectKey, setVideoObjectKey] = useState<string | null>(null);

  const sysDictPager = async () => {
    const resp = await api.get<Option[]>(
      '/management/sys/dict/sysDictGroupCode',
      {sysDictGroupCode: 'projectEvent'},
    );
    setEventTypeList(resp.data);
  };

  useEffect(() => {
    sysDictPager();
  }, []);

  const takePhoto = async () => {
    launchCamera({mediaType: 'photo', saveToPhotos: true}, async response => {
      console.log('🍎 ~ takePhoto ~ response:', response);
      if (!response.assets?.[0]) return;
      const asset = response.assets[0];
      const {uri, fileName, type} = asset;
      if (!uri) return;
      try {
        setTitle('照片上传中...');
        setActivityLoading(true);
        const uploadName = fileName || generateFileName(uri);
        const {objectKey, preSignedUrl} = await getPreSignedUrl(
          uploadName,
          'your-parent-dir',
        );
        const res = await fetch(uri);
        const blob = await res.blob();
        await fetch(preSignedUrl, {
          method: 'PUT',
          body: blob,
          headers: {'Content-Type': type || 'application/octet-stream'},
        });
        const previewUrl = await getPreSignedUrlFromKey(objectKey);
        setImgList(prev => [...prev, previewUrl]);
        setObjectKey(prev => [...prev, objectKey]);
        setActivityLoading(false);
      } catch (err) {
        console.error('上传失败', err);
      }
    });
  };
  const removePhoto = (index: number) => {
    setImgList(prev => prev.filter((_, i) => i !== index));
  };

  const takeVideo = () => {
    launchCamera({mediaType: 'video', saveToPhotos: true}, async response => {
      if (!response.assets?.[0]) return;
      const asset = response.assets[0];
      const {uri, fileName, type} = asset;
      if (!uri) return;
      try {
        setTitle('视频上传中...');
        setActivityLoading(true);
        const uploadName = fileName || generateFileName(uri);
        const {objectKey, preSignedUrl} = await getPreSignedUrl(
          uploadName,
          'your-parent-dir',
        );
        const res = await fetch(uri);
        const blob = await res.blob();
        await fetch(preSignedUrl, {
          method: 'PUT',
          body: blob,
          headers: {'Content-Type': type || 'application/octet-stream'},
        });
        const previewUrl = await getPreSignedUrlFromKey(objectKey);
        setVideoUri(previewUrl);
        setVideoObjectKey(objectKey);
        setActivityLoading(false);
      } catch (err) {
        console.error('上传失败', err);
      }
    });
  };

  function clear() {
    setSelectedType(null);
    setImgList([]);
    setObjectKey([]);
    setVideoUri(null);
    setVideoObjectKey(null);
    setRemark('');
  }
  const submit = function () {
    console.log('useProject().myProject;', myProject);
    setLoading(true);
    const myProject_ = myProject as MyProject;
    if (!selectedType) {
      Alert.alert('提示', '请选择事件类型', [
        {
          text: '确定',
          onPress: () => setLoading(false),
        },
      ]);
      return;
    }
    if (!remark.trim()) {
      Alert.alert('提示', '请输入备注', [
        {
          text: '确定',
          onPress: () => setLoading(false),
        },
      ]);
      return;
    }
    const params: SubmitData = {
      projectId: myProject_.snowFlakeId,
      sysDictDataId: selectedType.value,
      remark: remark,
    };
    if (objectKey.length > 0) {
      params.imgList = [...objectKey];
    }
    if (videoObjectKey) {
      params.video = videoObjectKey;
    }

    console.log('params', params);

    api
      .post('/wechat/signPunch/eventReporting', {...params})
      .then(res => {
        if (res.code === 200) {
          Alert.alert('事件上报成功');
          clear();
          setLoading(false);
        } else {
          Alert.alert(res?.message);
          setLoading(false);
        }
      })
      .catch(error => {
        Alert.alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setVisible(true);
          }}
          style={styles.top}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#FF0000', fontSize: 22, marginRight: 10}}>
              *
            </Text>
            {selectedType ? (
              <Text style={{fontSize: 22}}>已选择：{selectedType?.label}</Text>
            ) : (
              <Text style={{fontSize: 22}}>选择事件类型</Text>
            )}
          </View>

          <Ionicons name={'arrow-forward'} size={50} color={'#aaa'} />
        </TouchableOpacity>

        <View style={styles.center}>
          {/* 上传照片： */}
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Text style={styles.bigText}>上传照片：</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                takePhoto();
              }}
              style={styles.upLoadStyle}>
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
                    Alert.alert(
                      '删除确认',
                      '确定要删除这张图片吗？',
                      [
                        {text: '取消', style: 'cancel'},
                        {
                          text: '删除',
                          style: 'destructive',
                          onPress: () => removePhoto(index),
                        },
                      ],
                      {cancelable: true},
                    );
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
              style={styles.upLoadStyle}>
              <Ionicons name={'videocam-outline'} size={50} color={'#aaa'} />
            </TouchableOpacity>
          </View>
          <View>
            {videoUri && (
              <Video
                source={{uri: videoUri}}
                style={{width: 150, height: 100}}
                controls={true} // 显示播放控制条
                resizeMode="contain"
              />
            )}
          </View>

          {/* 备注： */}
          <TextInput
            value={remark} // ✅ 绑定值
            onChangeText={setRemark} // ✅ 更新值
            mode="outlined"
            label="备注："
            multiline
            style={styles.fixedHeight}
          />
        </View>

        {eventTypeList && (
          <EventTypeBottomSheet
            title="选择事件类型"
            visible={visible}
            onClose={() => setVisible(false)}
            eventTypeList={eventTypeList}
            value={selectedType}
            onChange={val => setSelectedType(val)} // 子组件传回值
          />
        )}
      </ScrollView>

      <TouchableOpacity onPress={submit}>
        <View style={styles.submitBtn}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>事件上报</Text>
          )}
        </View>
      </TouchableOpacity>

      <LoadingOverlay visible={activityLoading} title={title} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ccc'},
  bigText: {
    width: 120,
    fontSize: 22,
  },
  top: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  center: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 10,
  },

  preview: {
    height: 100,
    width: 100,
    marginLeft: 10,
    borderRadius: 10,
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
  fixedHeight: {
    height: 100,
    backgroundColor: '#fff',
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
});
