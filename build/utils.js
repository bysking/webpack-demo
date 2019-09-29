const path = require('path')

module.exports = { //返回传入字符串生成目录的绝地路径
  assetsPath (_path) {
    const assetsPathDir = 'static'
    return path.posix.resolve(assetsPathDir, _path)
  }
}