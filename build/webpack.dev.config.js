// 只在开发模式使用的打包配置文件
const merge = require('webpack-merge') // npm install webpack-merge --save-dev
const webpackBaseConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require('path')
const webpack = require('webpack')
const apis = require('./apis')
const { fileConfig } = require('./apiFileConfig')
const fileCFG = fileConfig[process.env.ENV] // config.xml的生成
const GenerateApiConfigFileWebpackPlugin = require('./generate-api-config-file-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { getLocalIp } = require('./utils')

module.exports = merge(webpackBaseConfig, {
  mode: "development", // 指定模式，不要压缩，丑化
  devtool: '#source-map', // 方便调试代码行
  output: {
    filename: '[name].js',
    publicPath: '/dist/',
    chunkFilename: '[name].chunk.js'
    // path: path.resolve(__dirname, '../widget/code/dist/')
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
    // new CleanWebpackPlugin(),

    // new CopyWebpackPlugin([ // 上一个清理完后需要把代码中赖的资源赋值到apicloud和webpack打包目录相同的目录层级
    //   {
    //     from: path.resolve(__dirname, '../static'), // 源
    //     to: path.resolve(__dirname, '../widget/code/static'), // 目标
    //     ignore: ['*.png']
    //   }
    // ]),
    new HtmlWebpackPlugin({ // 打包后需要利用自己的模板，生成index.html文件并且插入打包后的入口文件
      title: 'bysking-webpack-demo',
      filename: '../index.html', // vue入口文件放在在output.path定义的上一级
      template: path.resolve(__dirname, './config/template/index/vue-index.ejs'), // 入口模板
      injetc: false
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env), // 给源代码全局传自定义的变量，还可以是自定义的文件
      'process.env.RUN_DEVELOPMENT': JSON.stringify('development'), // 可以在当前文件开头出自定义变量，这里放入变量，在代码中使用，当前为开发模式所以devlopment生产环境模式类似
      'process.env.ENV': JSON.stringify(process.env.ENV), // api接口的动态导出
      'process.API_CFG': JSON.stringify(apis), // api接口的动态导出
      // 。。。。还可以配置其他导入文件，版本号，默认用户名json文件
    }),
    new GenerateApiConfigFileWebpackPlugin(fileCFG, process.env.ENV, true),
  ],
  //设置跨域代理 同源策略： 请求url与当前页面的协议 主机名 端口任意一个不同即为跨域
  devServer: { // 什么是跨域 https://blog.csdn.net/qq_38128179/article/details/84956552
    open: true,
    stats: 'errors-only',
    // public: `http://${getLocalIp()}:4002`, // 此处就直接通过局域网打开，这样手机端和网页端同一个入口，编译完成自动打开地址，不然网页端从localhost：4002打开，手机端从局域网打开就会造成手机端无法热更新，或者把此行代码注释掉显然都从局域网打开更加方便
    port: 4002,
    proxy: {
      '/saas': {
        target: apis.saas, // apis里面配置了根据环境动态打包不同环境的地址
        pathRewrite: { '^/saas': '/' },
        changeOrigin: true
      },
      '/pass': {
        target: apis.passport,
        pathRewrite: { '^/pass': '/' },
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