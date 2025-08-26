module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // presets: ['module:metro-react-native-babel-preset'],

  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['./src'], // 以 src 为根路径
        extensions: ['.js', '.ts', '.tsx', '.jsx'],
        alias: {
          '@': './src', // @ 代表 src
        },
      },
    ],
  ],
};
