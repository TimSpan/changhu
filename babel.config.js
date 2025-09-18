module.exports = {
  presets: ['babel-preset-expo'],
  // 也可以用 metro 的 preset，看你项目需要
  // presets: ['babel-preset-expo'],

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
