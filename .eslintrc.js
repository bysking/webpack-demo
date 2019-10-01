module.exports = {
  extends: 'standard',
  parser: 'babel-eslint',
  plugins: ['html', 'standard'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    camelcase: 0,
    'no-extend-native': 0,
    'no-return-await': 0,
    'no-new': 0
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    process: true,
    apiready: true,
    api: true,
    md5: true,
  }
};