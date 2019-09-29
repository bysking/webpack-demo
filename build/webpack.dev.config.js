// 只在开发模式使用的打包配置文件
const merge = require('webpack-merge') // npm install webpack-merge --save-dev
const webpackBaseConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require('path')

module.exports = merge(webpackBaseConfig, {
  mode: "development", // 指定模式，不要压缩，丑化
  output: {
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'bysking-webpack-demo',
      filename: '../dist/index.html',
      template: path.resolve(__dirname, './config/index.html'),
      injetc: false
    })
  ]
})