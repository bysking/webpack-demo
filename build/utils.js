const path = require('path')
const os = require('os')
const ifaces = os.networkInterfaces()

module.exports = { //返回传入字符串生成目录的绝地路径
  assetsPath (_path) {
    const assetsPathDir = 'static'
    return path.posix.resolve(assetsPathDir, _path)
  },

  /**
   * 获取局域网ip
   */
  getLocalIp() {
    return Object.keys(ifaces).reduce((localIp, ifname) => {
      ifaces[ifname].forEach(iface => {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return;
        }
        localIp = iface.address;
        // localIp = 'http://192.168.0.101';
      });
      return localIp;
    }, '');
  }
}

