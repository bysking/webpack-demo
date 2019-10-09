const { getLocalIp } = require('./utils')
module.exports = {
  fileConfig: { // 生成apicloud的入口文件
    dev: [
      {
        modelPath: './config/apicloudtemplate/apia.ejs',
        generateFilePath: '../widget/config.xml'
      },
      {
        modelPath: './config/apicloudtemplate/index.ejs',
        generateFilePath: '../widget/index.html'
      },
      { // 生成js文件里面是localhost: .... 的形式，让apicloud在浏览器或者手机端打开不同阿地址，控制打开的地址
        modelPath: './config/apicloudtemplate/ip.ejs',
        generateFilePath: '../widget/ip.js',
        params: { ip: getLocalIp() } // 传递给模板的参数对象
      }
    ],
    prod: [
      {
        modelPath: './config/apicloudtemplate/apib.ejs',
        generateFilePath: '../widget/config.xml'
      },
      {
        modelPath: './config/apicloudtemplate/index.ejs',
        generateFilePath: '../widget/index.html'
      }
    ]
  }
}