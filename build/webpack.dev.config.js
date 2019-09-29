// 只在开发模式使用的打包配置文件
const merge = require('webpack-merge') // npm install webpack-merge --save-dev
const webpackBaseConfig = require('./webpack.base.config')
module.exports = merge(webpackBaseConfig, {
  mode: "development", // 指定模式，不要压缩，丑化
  output: {
    filename: '[name].js'
  }
})