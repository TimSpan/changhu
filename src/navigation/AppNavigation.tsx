// AppNavigation.tsx
import React from 'react';
import {screens} from './screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AntDesign} from '@react-native-vector-icons/ant-design';
import SplashScreen from '@/screens/SplashScreen';
import LoginScreen from '@/screens/LoginScreen';
import {useAuthStore} from '@/stores/auth';
import {RootStackParamList} from './types';
import {Home} from '@/screens/Tabs/Home';
import {Center} from '@/screens/Tabs/Center';
import {User} from '@/screens/Tabs/User';
import {useProject} from '@/stores/userProject';
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
function HomeStackScreen() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {backgroundColor: '#2080F0'},
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      <RootStack.Screen name='Home' component={Home} options={{title: '打卡'}} />
    </RootStack.Navigator>
  );
}

function CenterStackScreen() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#2080F0'},
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerShown: false,
      }}
    >
      <RootStack.Screen name='Center' component={Center} options={{title: '功能中心'}} />
    </RootStack.Navigator>
  );
}
function UserStackScreen() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {backgroundColor: '#2080F0'},
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      <RootStack.Screen name='User' component={User} options={{title: '我的'}} />
    </RootStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName: any = 'home';
          if (route.name === 'home') iconName = 'home';
          else if (route.name === 'center') iconName = 'appstore';
          else if (route.name === 'user') iconName = 'user';
          return <AntDesign name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2080F0',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {fontSize: 16}, // 调大字体
        tabBarStyle: {height: 60}, // 调高整个 tabBar
      })}
    >
      {/* <Tab.Screen
        name="home"
        component={HomeStackScreen}
        options={{title: '打卡'}}
      /> */}

      <Tab.Screen name='center' component={CenterStackScreen} options={{title: '功能中心'}} />
      <Tab.Screen name='user' component={UserStackScreen} options={{title: '我的'}} />
    </Tab.Navigator>
  );
}

export function AppNavigation() {
  const {hasHydrated, tokenInfo} = useAuthStore();
  const {_hasHydrated, myProject} = useProject();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (hasHydrated) {
      setLoading(false);
    }
  }, [hasHydrated]);

  if (loading || !_hasHydrated) {
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator>
      {tokenInfo && myProject ? (
        <>
          <RootStack.Screen name='MainTabs' component={MainTabs} options={{headerShown: false}} />

          {screens.map(screen => (
            <RootStack.Screen key={screen.name} name={screen.name} component={screen.component} options={screen.options} />
          ))}
        </>
      ) : (
        <RootStack.Screen name='Login' component={LoginScreen} options={{headerShown: false}} />
      )}
    </RootStack.Navigator>
  );
}
