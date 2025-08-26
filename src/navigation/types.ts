// 路由类型定义（TypeScript）

export type RootStackParamList = {
  ImagePreview: undefined;
  Index2: undefined;
  Index3: undefined;
  HomeMain: undefined;
  MainTabs: undefined;
  Home: undefined;
  Test: undefined;
  ShowComponents: {params: number};
  Login: undefined;
  Splash: undefined;
  Camera: {setPhotoUri: React.Dispatch<React.SetStateAction<string | null>>};
  Video: {setVideoUri: React.Dispatch<React.SetStateAction<string | null>>};
};
