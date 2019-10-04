module.exports = {
  // extends: ['standard'],
  extends: ['standard', "plugin:vue/recommended"],
  // parser: 'babel-eslint',
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  plugins: ['html', 'standard', "vue"],
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