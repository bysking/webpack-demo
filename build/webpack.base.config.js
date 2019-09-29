//  基础配置文件 会抽离dev prod配置文件的公共配置
const path = require('path')
module.exports = {
  entry: {
    main: '@/main.js',
    'vender-exten': '@/vender/common-module.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/')
  },
  resolve: { // 配置路径别名
    extensions: ['.js'], // 别名可使用范围？
    alias: {
      '@': path.join(__dirname, '../src') // 路径别名
    }
  }
}