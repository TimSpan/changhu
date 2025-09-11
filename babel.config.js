module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // 也可以用 metro 的 preset，看你项目需要
  // presets: ['module:metro-react-native-babel-preset'],

  plugins: [
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
    'react-native-worklets/plugin', // ✅ 只保留这个
  ],
};
