/**
 * 网络请求辅助函数，默认 body 和返回值都为 json 格式
 */
const fetch = require('node-fetch')
const log4js = require('log4js')

const logger = log4js.getLogger()

const joinParams = (url, params) => {
  if (!params || params.keys.length === 0) {
    return url
  }

  const paramStr = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')
  return `${url}?${paramStr}`
}

const parseResponse = (response) => {
  if (response.status !== 200) {
    logger.log('请求失败', response.status, response.statusText, response.url)
    return null
  }

  return response.json().catch(err => {
    logger.log('返回数据格式错误', response.text(), response.url)
    return null
  })
}

const httpGet = (url, { params } = {}) => {
  return fetch(joinParams(url, params))
    .then((response) => parseResponse(response))
    .catch((err) => {
      logger.error(err)
      logger.error(url)
      return null
    }
  )
}

const httpPost = (url, { params, body } = {}) => {
  return fetch(joinParams(url, params), {
    method: 'post',
    body: body ? JSON.stringify(body) : '',
    headers: {'Content-Type': 'application/json'}
  })
  .then((response) => parseResponse(response))
  .catch((err) => {
    logger.error(err)
    logger.error(url)
    return null
  })
}

module.exports = {
  httpGet,
  httpPost
}
