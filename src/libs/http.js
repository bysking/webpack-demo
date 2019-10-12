import { getBrowserState } from './enum'
import aui from './aui' // 展示提示信息
import astore from './astore' // 请求会使用其中的token
import util from './util'
import merge from 'lodash/merge'
import axios from 'axios'

// const ApiCfg = process.API_CFG
export const ApiCfg = process.API_CFG
// http单例模式构造请求实例
class Http { // 新建立Http类，因为需要实现单例模式，代码架构需要这么写
  async req ([ // 定义req异步处理方法， 参数为数组解构
    baseUrl,
    apiObj,
    routeParams = null, // 数组默认值，如果是对象解构，需要进行 function myFun({a="", b=""} = {}) {}
    bodyParams = null,
    isHideLoading = false,
    isHideErrMsg = false
  ]) {
    this._baseUrl = baseUrl // 把解构的参数挂到Http上
    this._apiObj = apiObj // 请求接口对象
    this._routeParams = routeParams // 路由参数
    this._bodyParams = bodyParams // 普通参数
    this._isHideLoading = isHideLoading // 隐藏加载动画
    this._isHideErrMsg = isHideErrMsg // 隐藏错误提示
    const { path, method } = this._apiObj // 接口对象定义为由path和请求方法组成的对象如： { path: 'user_info', method: 'get' }

    if (!path || !['get', 'post', 'delete', 'put'].includes(method)) { // 参数合法性检查：对于path: 要求非空， 对于method要求范围在{get, post, delete, put} 内, 否则报错
      aui.showErr('无效的apiObj')
      return
    }

    if (!isHideLoading) aui.showLoading() // 加载loading动画

    const apiPath =
      Array.isArray(this._routeParams) && this._routeParams.length // 如果路由参数数组有值就把他拼接到path上返回给apiPath
        ? this.fillApi(path)
        : path // 路由上没有参数，apiPath就直接是path，不需要拼接地址

    this._bodyParams && this.handleBodyParams(this._bodyParams) // 如果有普通参数就处理普通参数

    const fullPath =
      this._baseUrl +
      apiPath +
      (['get', 'delete'].includes(method) ? this.constructQueryParams() : '') // 完整请求路径地址拼接，特殊处理get,delete的情况constructQueryParams

    console.log('[http-->' + method.toUpperCase() + ']', fullPath, bodyParams) // 这里需要调用util封装的统一日志打印log方法，这里后期再优化

    const axiosConfig = { // 上面url处理完了，现在需根据后台需求配置请求头等配置对象，类似请求参数打包，
      url: fullPath, // 完整请求地址
      method, // 请求方法
      headers: { // 请求头配置
        'X-Access-Token': astore.getToken(), // token携带
        from: 'bysking-app', // 其他参数,比如标识请求的app来源，因为一般一套后台接口可以供多个前端使用， 后台记录日志需要区分哪一个端获取了数据
        'Content-Type': 'application/json' // 期望后台返回的数据类型
      }
    }

    if (['post', 'put', 'delete'].includes(method) && this._bodyParams) { // 请求方法method类型包含在post, put, delete内，并且传递了普通参数，这里手机端和pc端对post等传递的数据处理不一致，需要兼容
      axiosConfig.data = getBrowserState() // 获取设备环境
        ? this._bodyParams // true PC端 直接把请求参数对象放在data下面 data: { name: ''bysking }
        : {
          body: JSON.stringify(this._bodyParams) // false 手机端 需要裹一层body-----JSON.stringify(data: { body: { name: 'bysking' } }) 同时序列化
        }
    }

    try { // 进行请求发送和异常捕获
      const res = await this.Axios(axiosConfig) // 调用封装了axios的函数发请求

      aui.hideToast() // 请求完毕关闭loading

      // util.logWarn('[http<--' + method.toUpperCase() + ']', fullPath, 'res:', res)

      if (res && !res.data) { // 因为请求成功和请求失败的数据解构不一样，于是这里手动兼容数据格式，就可以统一用解构对res.data进行操作，巧妙
        res.data = res
      }
      const { ErrNo, ErrMsg, err_code, err_msg, result } = res.data

      if (err_code === 4000000) { // 这里是后台商定的错误码处理，比如token过期，伪造token就返回指定错误码
        logOut(1500)
      }
      if (!isHideErrMsg) { // 展示错误
        if (ErrNo && ErrMsg) { // 这里兼容PC，手机端的错误返回字段
          aui.showErr(ErrMsg)
        }

        if (err_code && err_msg) {
          aui.showErr(err_msg)
        }
      }

      return { res: result ? res.data.result : res.data, err: null } // 结果返回， result是为了兼容请求错误和请求正常但服务端返回错误提示
    } catch (err) {
      // util.logWarn('[http<--' + method.toUpperCase() + ']', fullPath, 'err:', err)
      aui.hideToast() // 报错后需要隐藏加载动画

      let err2 = err.body ? err.body : err.response.data // 兼容请求报错在PC和移动端的返回

      // 因为我们需要对错误统一处理逻辑，不管请求成功与否我们都需要返回一个对象 { res: ..., err,...}, err只要有值就一定含有err_msg
      if (util.isString(err.body)) {
        err2 = { err_msg: err.body } // 构造err_msg
      }

      const { err_code, err_msg } = err2 // 错误信息我们只关心两个东西错误码和错误信息其他不关心， 只解构这两个

      if (err_code === 401002) { // 指定某个错误码，进行退出操作
        logOut(300)
      }
      if (err_msg && !isHideErrMsg) {
        aui.showToast(err_msg) // 是否弹窗报错
      }

      return { res: null, err: err2 } // 针对所有请求异常， 统一返回{ res: null, err } res为null, 返回err
    }
  }

  async Axios (baseConfig) {
    const config = merge(
      baseConfig,
      getBrowserState()
        ? { withCredentials: false } // 电脑端，额外参数 请求允许携带cookie
        : { timeout: 60, encode: false, charset: 'utf-8', dataType: 'json' } // 手机端需要的额外参数
    )

    return getBrowserState() // 根据设备环境判断调用的请求方法
      ? await axios(config) // 浏览器请求方法
      : await new Promise((resolve, reject) => {
        api.ajax(config, (res, err) => { // 手机端调用api.ajax请求方法
          if (err || !res) {
            // util.logWarn('[http<--ajax]', 'err:', err) // 后期优化
            reject(err)
          }
          resolve(res)
        })
      })
  }

  fillApi (path) { // 拼接请求path
    const reg = /:/ // 正则匹配:

    if (!reg.test(path)) return path // path如果不是： room/:roomId， 就直接返回path不需要拼接，因为path未定义需要url参数

    return path
      .split('/')
      .map(item => { //  room/:roomId ==》 [room, :roomId] ==> [room, '路由参数取出第一个替换:roomId']
        return reg.test(item) ? this._routeParams.shift() : item
      })
      .join('/') // [room, 123] ==> room/123 // 路由参数拼接完毕
  }

  handleBodyParams (bodyParams) { // 处理普通参数， 递归去除 undefined, null, []
    Object.keys(bodyParams).forEach(bodyKey => {
      const bodyValue = bodyParams[bodyKey]

      if (
        (!bodyValue &&
          typeof bodyValue !== 'number' &&
          typeof bodyValue !== 'boolean') ||
        (Array.isArray(bodyValue) && !bodyValue.length)
      ) {
        // 清除null和undefined和空数组的body
        delete bodyParams[bodyKey] // delete 方法删除对象键值
      }

      if (!!bodyValue && typeof bodyValue === 'object') {
        this.handleBodyParams(bodyValue) // 递归处理
      }
    })
  }

  constructQueryParams () { // get delete两种请求的普通参数需要拼接到url中
    if (!this._bodyParams) { // 参数检查
      return ''
    }
    return Object.keys(this._bodyParams).reduce((result, key) => {
      const value = this._bodyParams[key]
      return (result += (result === '' ? '?' : '&') + `${key}=${value}`)
      // getUser ==> getUser?name=bysking&age=12&sex=boy
    }, '') // ''传递result的初始值
  }
}
const http = (() => { // 立即执行函数，定义后直接执行
  let _instance = null // 局部变量

  return {
    getInstance: () => {
      if (!_instance) {
        _instance = new Http()
      }
      return _instance // 每一次调用http.getInstance(), 如果_instance存在就直接返回， 否则新建一个再返回
    }
  }
})()

export function reqPass (...args) {
  // 处理登录注册
  // 修改密码等操作
  const baseUrl = getBrowserState() ? '/passport/' : ApiCfg.passport // 因为浏览器跨域会匹配/passport/ 转到 ApiCfg.passport，不能直接请求ApiCfg.passport
  return http.getInstance().req([baseUrl, ...args])
}
export function reqSaas (...args) {
  // 处理后台数据接口
  // let baseUrl
  // if (getBrowserState()) {
  //   baseUrl = '/saas/' // 因为浏览器跨域会匹配/saas/ 转到 ApiCfg.saas，不能直接请求ApiCfg.saas, 手机端则不存在这种现象
  // } else {
  //   // 在dev或test环境中，如果缓存中有保存的环境，则使用缓存中的环境
  //   const env = astore.getEnv()
  //   baseUrl = env || ApiCfg.saas
  // }
  const baseUrl = getBrowserState() ? '/saas/' : ApiCfg.saas // 因为浏览器跨域会匹配/saas/ 转到 ApiCfg.saas，不能直接请求ApiCfg.saas, 手机端则不存在这种现象
  return http.getInstance().req([baseUrl, ...args])
}
export function reqSdk (...args) {
  // 处理第三方数据SDK数据接口
  const baseUrl = getBrowserState() ? '/sdk/' : ApiCfg.sdk
  return http.getInstance().req([baseUrl, ...args])
}

export function logOut () {
  // 处理用户退出, 分两种情况，浏览器退出（强制刷新） window.location.reload()， 手机端退出 api.refreshHeaderLoadDone() api.rebootApp()
  // 最后需要清除本地数据
}
