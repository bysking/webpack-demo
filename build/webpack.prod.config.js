//  只在生产环境的打包配置文件

const baseConfig = require('./webpack.base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件，支持按需加载css和sourceMap
const merge = require('webpack-merge')
const path = require('path')

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../widget/code/dist/'),
    publicPath: './dist',
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve(__dirname, '../src')], // 用path.resolve(__dirname, '../src')
        options: {
          emitError: true,
          emitWarning: true,
          failOnError: true
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader']
      },
      {
        test: /\.(stylus|styl)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      }
    ]
  },
  plugins: [
    // 自定义插件生成html模板文件
    // 定义生产环境的全局变量
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env), // 给源代码全局传自定义的变量，还可以是自定义的文件
      'process.env.RUN_DEVELOPMENT': JSON.stringify('production'), // 可以在当前文件开头出自定义变量，这里放入变量，在代码中使用，当前为开发模式所以devlopment生产环境模式类似
      'process.env.ENV': JSON.stringify(process.env.ENV), // api接口的动态导出
      // 。。。。还可以配置其他导入文件，版本号，默认用户名json文件
    }),
    // css提取
    new MiniCssExtractPlugin({ // css抽取成单独文件
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false,
    }),
  ],
})