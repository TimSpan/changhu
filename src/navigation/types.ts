// 路由类型定义（TypeScript）

import {User} from '@/screens/Pages/FaceRecognitionPunch/type';

export type RootStackParamList = {
  Test: undefined;
  Login: undefined;
  Splash: undefined;
  MainTabs: undefined;
  // Tabs页面
  Home: undefined;
  Center: undefined;
  User: undefined;
  // 子页面
  Report: undefined;
  Patrol: undefined;

  PatrolDetails: {id: string; type: number};
  BloodPressure: undefined;
  FaceRecognitionPunch: undefined;
  BloodForm: {params: User};
};
