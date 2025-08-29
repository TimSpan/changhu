import {PatrolScreen} from '@/screens/Pages/PatrolScreen';
import {ReportScreen} from '@/screens/Pages/ReportScreen';
import {RootStackParamList} from './types';
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
];
