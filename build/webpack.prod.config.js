//  只在生产环境的打包配置文件

const baseConfig = require('./webpack.base.config')
const merge = require('webpack-merge')
const path = require('path')

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../widget/code/dist/'),
    publicPath: './dist',
    filename: '[name].[hash].js'
  }
})