//  只在生产环境的打包配置文件

const baseConfig = require('./webpack.base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将CSS提取为独立的文件的插件，对每个包含css的js文件都会创建一个CSS文件，支持按需加载css和sourceMap
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

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

    new CleanWebpackPlugin(),

    new CopyWebpackPlugin([ // 上一个清理完后需要把代码中赖的资源赋值到apicloud和webpack打包目录相同的目录层级
      {
        from: path.resolve(__dirname, '../static'), // 源
        to: path.resolve(__dirname, '../widget/code/static'), // 目标
        ignore: ['*.png']
      }
    ]),

    new HtmlWebpackPlugin({ // 打包后需要利用自己的模板，生成index.html文件并且插入打包后的入口文件
      title: 'bysking-webpack-demo',
      filename: '../index.html', // 注意与output.path以及publicPath的关系
      template: path.resolve(__dirname, './config/template/index/vue-index.ejs'),
      injetc: false
    }),
  ],
  optimization: { // 代码压缩丑化
    splitChunks: { // 分片，异步加载
      cacheGroups: {// 缓存组
        commons: { // 按需打包抽离公共模块
          test: /[\\/]node_modules[\\/]/, // 只抽取引入的node_modules文件的公共模块
          name: 'vender-exten', // 要缓存的 分隔出来的 chunk 名称
          chunks: 'all' // 对所有的chunk都进行缓存
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    // 当更改app的时候runtime与（被分出的动态加载的代码）0.01e47fe5.js的名称(hash)不会改变，main的名称(hash)会改变。
    // 当更改component.js，main的名称(hash)不会改变，runtime与 (动态加载的代码) 0.01e47fe5.js的名称(hash)会改变。

    },
    minimizer: [
      new TerserJSPlugin({ // js压缩
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({}) // css压缩
    ]
  }
})