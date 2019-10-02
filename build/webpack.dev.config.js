// 只在开发模式使用的打包配置文件
const merge = require('webpack-merge') // npm install webpack-merge --save-dev
const webpackBaseConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require('path')
const webpack = require('webpack')
const apis = require('./apis')
const { fileConfig } = require('./apiFileConfig')
const fileCFG = fileConfig[process.env.ENV] // config.xml的生成
console.log('node环境', process.env.ENV)

module.exports = merge(webpackBaseConfig, {
  mode: "development", // 指定模式，不要压缩，丑化
  devtool: '#source-map', // 方便调试代码行
  output: {
    filename: '[name].js',
    publicPath: './',
    chunkFilename: '[name].chunk.js'
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
        use: ['vue-style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(stylus|styl)$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      }
    ]
  },
  plugins: [
    new GenerateApiConfigFileWebpackPlugin(fileCFG, process.env.ENV),
    new HtmlWebpackPlugin({ // 打包后需要利用自己的模板，生成index.html文件并且插入打包后的入口文件
      title: 'bysking-webpack-demo',
      filename: '../dist/index.html',
      template: path.resolve(__dirname, './config/index.ejs'),
      injetc: false
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env), // 给源代码全局传自定义的变量，还可以是自定义的文件
      'process.env.RUN_DEVELOPMENT': JSON.stringify('development'), // 可以在当前文件开头出自定义变量，这里放入变量，在代码中使用，当前为开发模式所以devlopment生产环境模式类似
      'process.env.ENV': JSON.stringify(process.env.ENV), // api接口的动态导出
      // 。。。。还可以配置其他导入文件，版本号，默认用户名json文件
    })
  ],
  //设置跨域代理 同源策略： 请求url与当前页面的协议 主机名 端口任意一个不同即为跨域
  devServer: { // 什么是跨域 https://blog.csdn.net/qq_38128179/article/details/84956552
    open: true,
    stats: 'errors-only',
    public: 'localhost:4001',
    port: 4001,
    proxy: {
      '/apione': {
        target: apis.apione, // apis里面配置了根据环境动态打包不同环境的地址
        pathRewrite: { '^/apione': '/' },
        changeOrigin: true
      },
      '/apitwo': {
        target: apis.apitwo,
        pathRewrite: { '^/apitwo': '/' },
        changeOrigin: true
      },
      '/apithree': {
        target: apis.apithree,
        pathRewrite: { '^/apithree': '/' },
        changeOrigin: true
      }
    }
  }
})