// 路由类型定义（TypeScript）

import {User} from '@/components/FaceRecognitionPunch/type';

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

  PatrolDetails: {id: string};
  BloodPressure: undefined;
  FaceRecognitionPunch: undefined;
  BloodForm: {params: User};
};
