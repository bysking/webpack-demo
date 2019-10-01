// 首先定义常量地址，然后下面根据系统的环境（development|production）来动态export对应的地址
// 注册登录 api
const passportDev = 'http://bysking.net:7080/';
const passportProd = 'http://bysking.net:7080/';
// 后台数据接口 api
const saasLocal = 'http://localhost:7001/v4/'; // 本地环境
const saasDev = 'http://bysking.com:2001/v4/'; // 开发环境
const saasTest = 'http://bysking.com:7001/v4/'; // 测试环境
const saasProd = 'https://bysking.com/v3/'; // 生产环境
// oss api (图片、视频)存储域名
const ossDev = 'http://bysking.com/' // 开发环境
const ossProd = 'https://bysking.com/' // 生产环境
// sdk api
const sdkDev = 'http://bysking.com/v4/sdk/' // 开发环境
const sdkProd = 'https://bysking.com/v3/sdk/' // 生产环境

// 因为需要使用环境参数来映射，于是直接把所有的环境量作为键，值为地址对象来export
const Api = {
  dev: {
    // 开发环境
    passport: passportDev,
    saas: saasDev,
    oss: ossDev,
    sdk: sdkDev,
  },
  test: {
    // 提测环境(测试版)
    passport: passportDev,
    saas: saasTest,
    oss: ossDev,
    sdk: sdkDev,
  },
  prod: {
    // 生产环境
    passport: passportProd,
    saas: saasProd,
    oss: ossProd,
    sdk: sdkProd,
  }
};
// 'process.env.ENV': JSON.stringify(process.env.ENV), // api接口的动态导出
module.exports = Api[process.env.ENV] || Api.prod;
