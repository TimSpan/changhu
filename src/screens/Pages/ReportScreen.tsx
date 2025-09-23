import {api} from '@/api/request';
import {useEffect, useState} from 'react';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {useProject} from '@/stores/userProject';
import {ActivityIndicator, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import EventTypeBottomSheet from '@/components/EventTypeBottomSheet';
import LoadingOverlay from '@/components/LoadingOverlay';
import {takeMediaUpload} from '@/components/TakeMedia';
import CustomInput from '@/components/CustomInput';
import {ConfirmAlert} from '@/components/ConfirmDialog/ConfirmDialogProvider';
import {useVideoPlayer, VideoView} from 'expo-video';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ImagePreview} from '@/components/ImagePreview';
const {width} = Dimensions.get('window');
export const ReportScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
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

  const player = useVideoPlayer(videoUri, player => {
    player.loop = true;
    player.play();
  });
  const sysDictPager = async () => {
    const resp = await api.get<Option[]>('/management/sys/dict/sysDictGroupCode', {sysDictGroupCode: 'projectEvent'});
    setEventTypeList(resp.data);
  };

  useEffect(() => {
    sysDictPager();
  }, []);

  const takePhoto = async () => {
    try {
      setTitle('照片上传中...');
      setActivityLoading(true);
      const res = await takeMediaUpload('photo', 'event-report');
      setImgList(prev => [...prev, res.previewUrl]);
      setObjectKey(prev => [...prev, res.objectKey]);
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
  const removePhoto = (index: number) => {
    setImgList(prev => prev.filter((_, i) => i !== index));
  };

  const takeVideo = async () => {
    try {
      setTitle('视频上传中...');
      setActivityLoading(true);
      const res = await takeMediaUpload('video', 'event-report');
      setVideoUri(res.previewUrl);
      setVideoObjectKey(res.objectKey);
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
    const myProject_ = myProject as MyProject;
    if (!selectedType) {
      ConfirmAlert.alert('提示', '请选择事件类型', [{text: '确定', onPress: () => {}}]);
      return;
    }
    if (!remark.trim()) {
      ConfirmAlert.alert('提示', '请输入备注', [{text: '确定', onPress: () => {}}]);
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

    setLoading(true);
    api
      .post('/wechat/signPunch/eventReporting', {...params})
      .then(res => {
        ConfirmAlert.alert('提示', res.message, [
          {
            text: '确定',
            onPress: () => {
              clear();
            },
          },
        ]);
      })
      .catch(error => {
        ConfirmAlert.alert('提示', error.message, [{text: '确定', onPress: () => {}}]);
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
          style={styles.top}
        >
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#FF0000', fontSize: 20, marginRight: 10}}>*</Text>
            {selectedType ? <Text style={{fontSize: 20}}>已选择：{selectedType?.label}</Text> : <Text style={{fontSize: 20}}>选择事件类型</Text>}
          </View>

          <Ionicons name={'arrow-forward'} size={30} color={'#aaa'} />
        </TouchableOpacity>

        <View style={styles.center}>
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

          {imgList.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false} // 隐藏横向滚动条，可选
              contentContainerStyle={{padding: 10}} // 内容样式，可选
            >
              {imgList.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setModalVisible(true);
                    setInitialIndex(index);
                  }}
                  onLongPress={() => {
                    ConfirmAlert.alert('提示', '确定要删除这张图片吗？', [
                      {text: '取消', style: 'cancel', onPress: () => {}},
                      {text: '确定', onPress: () => removePhoto(index)},
                    ]);
                  }}
                  delayLongPress={1000}
                >
                  <Image source={{uri}} style={styles.preview} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

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

          {videoUri && (
            <View style={styles.contentContainer}>
              <VideoView surfaceType='textureView' style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
            </View>
          )}
          <View>
            <Text style={styles.bigText}>备注：</Text>
            <CustomInput height={80} value={remark} onChangeText={setRemark} placeholder='请输入备注' />
          </View>
        </View>

        {eventTypeList && (
          <EventTypeBottomSheet
            title='选择事件类型'
            visible={visible}
            onClose={() => setVisible(false)}
            eventTypeList={eventTypeList}
            value={selectedType}
            onChange={val => setSelectedType(val)} // 子组件传回值
          />
        )}
      </ScrollView>

      <TouchableOpacity onPress={submit}>
        <View style={styles.submitBtn}>{loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.submitBtnText}>事件上报</Text>}</View>
      </TouchableOpacity>

      <LoadingOverlay visible={activityLoading} title={title} />
      <Modal visible={modalVisible} animationType='slide' onRequestClose={() => setModalVisible(false)}>
        <GestureHandlerRootView>
          <View style={{flex: 1}}>
            <ImagePreview imageList={imgList} initialIndex={initialIndex}></ImagePreview>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ccc'},
  bigText: {
    width: 120,
    fontSize: 20,
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
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: width,
    height: 250,
  },
  controlsContainer: {
    padding: 10,
  },
});
