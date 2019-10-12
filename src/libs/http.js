import { getBrowserState } from './enum'
// const ApiCfg = process.API_CFG
export const ApiCfg = process.API_CFG
// http单例模式构造请求实例
class Http {
  async req ([
    baseUrl,
    apiObj,
    routeParams = null,
    bodyParams = null,
    isHideLoading = false,
    isHideErrMsg = false
  ]) {
    this._baseUrl = baseUrl
    this._apiObj = apiObj
    this._routeParams = routeParams
    this._bodyParams = bodyParams
    // this._isHideLoading = isHideLoading
    // this._isHideErrMsg = isHideErrMsg
    const { path, method } = this._apiObj

    if (!path || !['get', 'post', 'delete', 'put'].includes(method)) {
      aui.showErr('无效的apiObj')
      return
    }

    if (!isHideLoading) aui.showLoading()

    const apiPath =
      Array.isArray(this._routeParams) && this._routeParams.length
        ? this.fillApi(path)
        : path

    this._bodyParams && this.handleBodyParams(this._bodyParams)

    const fullPath =
      this._baseUrl +
      apiPath +
      (['get', 'delete'].includes(method) ? this.constructQueryParams() : '')

    util.log('[http-->' + method.toUpperCase() + ']', fullPath, bodyParams)

    const axiosConfig = {
      url: fullPath,
      method,
      headers: {
        'X-Access-Token': astore.getAccessToken(),
        'yd-app': 'ydapp_zs',
        'Content-Type': 'application/json'
      }
    }

    if (['post', 'put', 'delete'].includes(method) && this._bodyParams) {
      axiosConfig.data = getBrowserState()
        ? this._bodyParams
        : {
          body: JSON.stringify(this._bodyParams)
        }
    }

    try {
      const res = await this.Axios(axiosConfig)

      aui.hideToast()

      util.logWarn('[http<--' + method.toUpperCase() + ']', fullPath, 'res:', res)

      if (res && !res.data) {
        res.data = res
      }

      const { ErrNo, ErrMsg, err_code, err_msg, result } = res.data

      if (err_code === 401002) {
        logout(1500)
      }
      if (!isHideErrMsg) {
        if (ErrNo && ErrMsg) {
          aui.showErr(ErrMsg)
        }

        if (err_code && err_msg) {
          aui.showErr(err_msg)
        }
      }

      return { res: result ? res.data.result : res.data, err: null }
    } catch (err) {
      util.logWarn('[http<--' + method.toUpperCase() + ']', fullPath, 'err:', err)
      aui.hideToast()

      let err2 = err.body ? err.body : err.response.data

      if (util.isString(err.body)) {
        err2 = { err_msg: err.body }
      }

      const { err_code, err_msg } = err2

      if (err_code === 401002) {
        logout(300)
      }
      if (err_msg && !isHideErrMsg) {
        aui.showErr(err_msg)
      }

      return { res: null, err: err2 }
    }
  }

  async Axios (baseConfig) {
    const config = merge(
      baseConfig,
      getBrowserState()
        ? { withCredentials: false }
        : { timeout: 60, encode: false, charset: 'utf-8', dataType: 'json' }
    )

    return getBrowserState()
      ? await axios(config)
      : await new Promise((resolve, reject) => {
        api.ajax(config, (res, err) => {
          if (err || !res) {
            util.logWarn('[http<--ajax]', 'err:', err)
            reject(err)
          }
          resolve(res)
        })
      })
  }

  fillApi (path) {
    const reg = /:/

    if (!reg.test(path)) return path

    return path
      .split('/')
      .map(item => {
        return reg.test(item) ? this._routeParams.shift() : item
      })
      .join('/')
  }

  handleBodyParams (bodyParams) {
    Object.keys(bodyParams).forEach(bodyKey => {
      const bodyValue = bodyParams[bodyKey]

      if (
        (!bodyValue &&
          typeof bodyValue !== 'number' &&
          typeof bodyValue !== 'boolean') ||
        (Array.isArray(bodyValue) && !bodyValue.length)
      ) {
        // 清除null和undefined和空数组的body
        delete bodyParams[bodyKey]
      }

      if (!!bodyValue && typeof bodyValue === 'object') {
        this.handleBodyParams(bodyValue)
      }
    })
  }

  constructQueryParams () {
    if (!this._bodyParams) {
      return ''
    }
    return Object.keys(this._bodyParams).reduce((result, key) => {
      const value = this._bodyParams[key]

      return (result += (result === '' ? '?' : '&') + `${key}=${value}`)
    }, '')
  }
}
const http = (() => {
  let _instance = null

  return {
    getInstance: () => {
      if (!_instance) {
        _instance = new Http()
      }
      return _instance
    }
  }
})()

export function reqPass () {
  // 处理登录注册
  // 修改密码等操作
}
export function reqSaas () {
  // 处理后台数据接口
}
export function reqSdk (args) {
  // 处理第三方数据SDK数据接口
  const baseUrl = getBrowserState() ? '/sdk/' : ApiCfg.sdk
  return http.getInstance().req([baseUrl, ...args])
}

export function logOut () {
  // 处理用户退出, 分两种情况，浏览器退出（强制刷新） window.location.reload()， 手机端退出 api.refreshHeaderLoadDone() api.rebootApp()
  // 最后需要清除本地数据
}
