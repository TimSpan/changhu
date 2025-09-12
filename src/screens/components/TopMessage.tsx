import {api} from '@/api/request';
import {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DetailsParam} from '../Pages/type';
import * as React from 'react';
import dayjs from 'dayjs';
import {Divider} from 'react-native-paper';

type Props = {
  id: string;
  type: number;
};
export const TopMessage: React.FC<Props> = ({id, type}) => {
  const [details, setDetails] = useState<DetailsParam>();

  const patrolPointDetails = async () => {
    const resp = await api.get<DetailsParam>('/wechat/patrolPoint/getPatrolPoint', {projectPatrolPointId: id});
    console.log('🍎 ~ patrolPointDetails ~ resp:', resp);
    setDetails(resp.data);
  };

  useEffect(() => {
    patrolPointDetails();
  }, [id]);

  const Tag = ({type, children}: {type?: string; children: React.ReactNode}) => {
    return (
      <View style={[styles.tag, type === 'success' && styles.tagSuccess, type === 'error' && styles.tagError]}>
        <Text style={styles.tagText}>{children}</Text>
      </View>
    );
  };

  const patrolStatus = useMemo(() => {
    const actual = Number(details?.actualCount) || 0;
    const required = Number(details?.requiredCount) || 0;
    if (actual >= required) {
      return true;
    } else {
      return false;
    }
  }, [details]);
  return (
    <View style={{backgroundColor: '#fff', margin: 8, padding: 8, borderRadius: 6}}>
      <View style={{}}>
        <Text style={{fontSize: 22}}>{details?.name}</Text>

        {type === 1 && <Tag type={patrolStatus ? 'success' : 'error'}>{patrolStatus ? '巡逻任务已完成' : '巡逻任务待完成'}</Tag>}
      </View>
      <Divider bold={true} />
      <View style={styles.cardRow}>
        <View>
          <Text style={styles.label}>
            巡逻要求：每
            <Text style={styles.highlight}>
              {details?.intervalValue}
              {details?.intervalUnit?.label}
            </Text>
            需要巡逻
            <Text style={styles.highlight}>{details?.requiredCount}</Text>次
          </Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.rowItem}>
          <Text style={styles.label}>巡逻周期：</Text>
          <Text style={styles.value}>{details?.cycle}</Text>
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>实际次数：</Text>
          <Text style={styles.value}>{details?.actualCount}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>
          巡逻时间：
          {dayjs(details?.startDate).format('YYYY-MM-DD')} -- {details?.endDate ? dayjs(details?.endDate).format('YYYY-MM-DD') : '长期有效'}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>状态：</Text>
        <View>
          <Tag type={details?.status?.extData?.type}>{details?.status?.label}</Tag>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Text style={styles.label}>备注：</Text>
        <Text style={styles.value}>{details?.remark || '无'}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#333',
  },
  value: {
    fontSize: 18,
    color: '#666',
  },
  highlight: {
    color: 'red',
    fontSize: 18,
    // paddingLeft: 10,
    // paddingRight: 10,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start', // 让子元素根据内容宽度自适应
    marginBottom: 4,
  },
  tagText: {
    fontSize: 18,
    color: '#333',
  },
  tagSuccess: {
    backgroundColor: '#00c48f',
  },
  tagError: {
    backgroundColor: 'red',
  },
});
