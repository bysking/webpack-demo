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