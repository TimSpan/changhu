import {PatrolScreen} from '@/screens/Pages/PatrolScreen';
import {ReportScreen} from '@/screens/Pages/ReportScreen';
import {RootStackParamList} from './types';
import {BloodPressure} from '@/screens/Pages/BloodPressure';
import {FaceRecognitionPunch} from '@/components/FaceRecognitionPunch';
import {BloodFormScreen} from '@/screens/Pages/BloodFormScreen';
import {Test} from '@/screens/Pages/Test';
type ScreenConfig = {
  name: keyof RootStackParamList; // 强制 name 属于 RootStackParamList
  component: React.ComponentType<any>;
  options?: any;
};

export const screens: ScreenConfig[] = [
  {
    name: 'Report',
    component: ReportScreen,
    options: {
      title: '事件上报',
      headerStyle: {backgroundColor: '#007bff'},
      headerTintColor: '#fff',
    },
  },
  {
    name: 'Patrol',
    component: PatrolScreen,
    options: {
      title: '巡逻',
      headerStyle: {backgroundColor: '#007bff'},
      headerTintColor: '#fff',
    },
  },
  {
    name: 'BloodPressure',
    component: BloodPressure,
    options: {
      title: '血压采集',
      headerStyle: {backgroundColor: '#007bff'},
      headerTintColor: '#fff',
    },
  },
  {
    name: 'FaceRecognitionPunch',
    component: FaceRecognitionPunch,
    options: {
      title: '血压采集',
      headerStyle: {backgroundColor: '#007bff'},
      headerTintColor: '#fff',
      headerShown: false,
    },
  },

  {
    name: 'BloodForm',
    component: BloodFormScreen,
    options: {
      title: '采集上传',
      headerStyle: {backgroundColor: '#007bff'},
      headerTintColor: '#fff',
    },
  },

  {
    name: 'Test',
    component: Test,
    options: {
      title: '测试',
      headerStyle: {backgroundColor: '#007bff'},
      headerTintColor: '#fff',
    },
  },
];
