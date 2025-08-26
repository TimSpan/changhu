// AppNavigation.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AntDesign} from '@react-native-vector-icons/ant-design';
import HomeScreen from '@/screens/HomeScreen';
import CameraScreen from '@/screens/CameraScreen';
import VideoScreen from '@/screens/VideoScreen';
import TestScreen from '@/screens/TestScreen';
import SplashScreen from '@/screens/SplashScreen';
import LoginScreen from '@/screens/LoginScreen';
import {useAuthStore} from '@/stores/auth';
import {Index2} from '@/screens/test/index2';
import {Index3} from '@/screens/test/index3';
import {RootStackParamList} from './types';
import ShowComponents from '@/screens/ShowComponents';
import ImagePreview from '@/screens/ImagePreview';
// import { BottomNavigation } from 'react-native-paper';
// import App from './BottomNavigation';
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
// const HomeStack = createNativeStackNavigator();

// Tab 内 HomeStack
function HomeStackScreen() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#007bff'},
        headerTintColor: '#fff',
      }}>
      <RootStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{title: '功能首页'}}
      />
    </RootStack.Navigator>
  );
}

function Index2_() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#007bff'},
        headerTintColor: '#fff',
      }}>
      <RootStack.Screen
        name="Index2"
        component={Index2}
        options={{title: 'index2'}}
      />
    </RootStack.Navigator>
  );
}
function Index3_() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#007bff'},
        headerTintColor: '#fff',
      }}>
      <RootStack.Screen
        name="Index3"
        component={Index3}
        options={{title: 'index3'}}
      />
    </RootStack.Navigator>
  );
}

// TabNavigator

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName: any = 'home';
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'CameraTab') iconName = 'camera';
          else if (route.name === 'VideoTab') iconName = 'play-square';
          else if (route.name === 'TestTab') iconName = 'java-script';
          return <AntDesign name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{title: '首页'}}
      />

      <Tab.Screen
        name="index2"
        component={Index2_}
        options={{title: 'index2'}}
      />
      <Tab.Screen
        name="VideoTab"
        component={Index3_}
        options={{title: 'index3'}}
      />
    </Tab.Navigator>
  );
}

// RootStack
export function AppNavigation() {
  const {token, restoreToken} = useAuthStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    restoreToken().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    // screenOptions={{ headerShown: false }} 隐藏头部
    <RootStack.Navigator>
      {token ? (
        <>
          <RootStack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{headerShown: false}}
          />
          <RootStack.Screen
            name="Test"
            component={TestScreen}
            options={{
              title: '接口测试',
              headerStyle: {backgroundColor: '#007bff'}, // 导航栏背景色
              headerTintColor: '#fff', // 标题和返回按钮颜色
            }}
          />

          <RootStack.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              title: '拍照',
              headerStyle: {backgroundColor: '#007bff'}, // 导航栏背景色
              headerTintColor: '#fff', // 标题和返回按钮颜色
            }}
          />
          <RootStack.Screen
            name="Video"
            component={VideoScreen}
            options={{
              title: '录像',
              headerStyle: {backgroundColor: '#007bff'}, // 导航栏背景色
              headerTintColor: '#fff', // 标题和返回按钮颜色
            }}
          />
          <RootStack.Screen
            name="ShowComponents"
            component={ShowComponents}
            options={{
              title: '组件展示',
              headerStyle: {backgroundColor: '#007bff'}, // 导航栏背景色
              headerTintColor: '#fff', // 标题和返回按钮颜色
            }}
          />

          <RootStack.Screen
            name="ImagePreview"
            component={ImagePreview}
            options={{
              title: '图片预览',
              headerStyle: {backgroundColor: '#007bff'}, // 导航栏背景色
              headerTintColor: '#fff', // 标题和返回按钮颜色
            }}
          />
        </>
      ) : (
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
      )}
    </RootStack.Navigator>
  );
}
