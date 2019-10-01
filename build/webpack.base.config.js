//  基础配置文件 会抽离dev prod配置文件的公共配置
const path = require('path')
const utils = require('./utils')
const VueLoaderPlugin = require('vue-loader/lib/plugin') // 首先最新的webpack使用vue-loader时还要在配置中添加 Vue Loader 的插件
module.exports = {
  entry: {
    main: '@/main.js',
    'vender-exten': '@/vender/common-module.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/')
  },
  module: {
    rules: [
      { // vue
        test: /\.vue$/, // vue-loader处理vue文件解析
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      { // js
        test: /\.js$/, // babel-loader处理js文件解析-->es5
        include: [
          path.resolve(__dirname, '../src'), // 资源文件
          path.resolve(__dirname, '../node_modules/vueg') // 动画模块
        ],
        loader: 'babel-loader?cacheDirectory=true' // 未修改文件不处理，性能
      },
      { // jsx
        test: /\.js[x]?$/, // babel-loader处理jsx或js文件解析-->es5
        exclude: /node_modules/, // 排除
        loader: 'babel-loader?cacheDirectory=true' // 未修改文件不处理，性能
      },
      { // 图片文件处理
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 这里正则不清楚(\?.*)?
        use: { // 使用对象是为了配置额外参数
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]') // 生成static/img/文件名哈希后缀
          }
        }
      },
      { // 视频文件处理
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // /\.(mp4|webm|ogg|mp3|wav|flac|ac)(\?.*)?$/
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        }
      },
      { // 字体文件处理
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin() // 首先最新的webpack使用vue-loader时还要在配置中添加 Vue Loader 的插件
  ],
  resolve: { // 配置路径别名
    extensions: ['.js'], // 别名可使用范围？
    // 当遇到  require('./data')  这样的导入语句时，Webpack 会先去寻找
    // ./data.js  文件，如果该文件不存在就去寻找  ./data.json  文件， 如果还是找不到就报错。
    alias: {
      '@': path.join(__dirname, '../src') // 路径别名
    }
  },
  externals: {

    // 假设：我们开发了一个自己的库，里面引用了lodash这个包，经过webpack打包的时候，发现如果把这个lodash包打入进去，打包文件就会非常大。
    // 那么我们就可以externals的方式引入。也就是说，自己的库本身不打包这个lodash，需要用户环境提供。比如下面的
    // vue: 'Vue',
    // iview: 'iview',
    // 'vue-router': 'VueRouter',
    // vuex: 'Vuex',
  }
}