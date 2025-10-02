module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@features': './src/features',
          '@navigation': './src/navigation',
          '@components': './src/components',
          '@unistyles': './src/unistyles',
          '@services': './src/services',
          '@states': './src/states',
          '@utils': './src/utils',
          '@screens': './src/screens',
          '@interfaces': './src/interfaces',
          '@styles': './src/styles',
          '@contexts': './src/contexts',
          '@api': './src/api',
          '@config': './src/config',
          '@store': './src/store',
        },
      },
    ],
  ],
};
