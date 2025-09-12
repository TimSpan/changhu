// 路由类型定义（TypeScript）

import {User} from '@/screens/Pages/FaceRecognitionPunch/type';

export type RootStackParamList = {
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

  PatrolDetails: {id: string; type: number; isScan: boolean};
  BloodPressure: undefined;
  FaceRecognitionPunch: undefined;
  BloodForm: {params: User};

  ScanCamera: undefined;
};
