const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const chalk = require('chalk')
const { getLocalIp } = require('./utils')
class GenerateApiConfigFileWebpackPlugin {
  constructor (options, env = 'dev', isWebpackDev = false) {
    this._config = options
    this._env = env
    this._isWebpackDev = isWebpackDev
    this.createFile()
  }

  apply(compiler) {
    compiler.hooks.done.tap('GenerateApiConfigFileWebpackPlugin', (stats) => {
      this._isWebpackDev && setTimeout(() => {
        console.log(
          chalk.magenta(
            `apicloud的config.xml入口文件编译完成,局域网ip: ${getLocalIp()}`
          )
        );
      }, 300)
    })
  }

  createFile () {
    // console.log(this._config)
    this._config.forEach(item => {
      const { modelPath, generateFilePath, params = null } = item;
      // console.log(path.join(__dirname, modelPath))
      // console.log(path.resolve(__dirname, modelPath))
      const str = fs.readFileSync(
        path.join(__dirname, modelPath),
        'utf8'
      );

      fs.writeFile(
        path.join(__dirname, generateFilePath),
        ejs.render(str, params || { env: this._env }),
        function (err) {
          if (err) {
            console.log(chalk.red('err', err));
            return;
          }
        }
      );

    });
  }
}

module.exports = GenerateApiConfigFileWebpackPlugin