import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  set: (key: string, value: any) =>
    AsyncStorage.setItem(key, JSON.stringify(value)),
  get: async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  remove: (key: string) => AsyncStorage.removeItem(key),
};
