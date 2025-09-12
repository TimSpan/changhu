import {PatrolScreen} from '@/screens/Pages/PatrolScreen';
import {ReportScreen} from '@/screens/Pages/ReportScreen';
import {RootStackParamList} from './types';
import {BloodPressure} from '@/screens/Pages/BloodPressure';
import {FaceRecognitionPunch} from '@/screens/Pages/FaceRecognitionPunch';
import {BloodFormScreen} from '@/screens/Pages/BloodFormScreen';
import {PatrolDetails} from '@/screens/Pages/PatrolDetailsScreen';
import {CodeScannerPage} from '@/screens/Pages/ScanCamera';

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
      title: '巡逻点列表',
      headerStyle: {backgroundColor: '#007bff'},
      headerTintColor: '#fff',
    },
  },
  {
    name: 'PatrolDetails',
    component: PatrolDetails,
    options: {
      title: '巡逻打卡',
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
      // unmountOnBlur: true, // 离开时卸载页面、这个属性 已经在7.0 版本后 弃用
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
    name: 'ScanCamera',
    component: CodeScannerPage,
    options: {
      headerShown: false,
      title: '测试',
      headerStyle: {backgroundColor: '#007bff'},
      headerTintColor: '#fff',
    },
  },
];
