const log4js = require('log4js')
const { httpGet, httpPost } = require('../utils/request')

const logger = log4js.getLogger()

const API_TOKEN = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ID&corpsecret=SECRET'
const API_SEND_MESSAGE = 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=ACCESS_TOKEN'

// 根据返回错误码判断是否需要重新获取 token
const isTokenExpired = (code) => {
  return code === 42001 || code === 42007 || code === 42009
}

class Wechat {
  constructor(config) {
    this.config = config
    this.accessToken = ''

    this.refreshToken()
  }

  async refreshToken() {
    this.accessToken = await this.getAccessToken()
  }

  async getAccessToken() {
    const { corpId, secret } = this.config
    const url = API_TOKEN.replace('ID', corpId).replace('SECRET', secret)
    const data = await httpGet(url)
    if (!data) {
      logger.error('获取请求失败')
      return ''
    }

    try {
      if (data.errcode !== 0) {
        logger.error(`获取 token 失败(${data.errcode}):${data.errmsg}`)
        return ''
      }

      return data.access_token
    } catch (err) {
      connsole.error(err)
      return ''
    }
  }

  // 发送文本消息
  async sendText({ users, message }, retry = false) {
    logger.log('send text', users, message)

    if (!users || !message) {
      return false
    }
  
    const { accessToken, config } = this
    if (!accessToken) {
      return false
    }

    const url = API_SEND_MESSAGE.replace('ACCESS_TOKEN', accessToken)
    const userParam = (Array.isArray(users) ? users : [users]).join('|')

    const data = await httpPost(url, {
      body: {
        "agentid": config.agentId,
        'touser' : userParam,
        'msgtype' : 'text',
        'text' : {
          'content' : message
        }
      }
    })

    if (data.errcode === 0) {
      return true
    }

    // 若刷新token 后还是有过期错误，返回失败
    if (isTokenExpired(data.errcode) && !retry) {
      await this.refreshToken()
      return this.sendText({ users, message }, true)
    }

    logger.log('发送信息失败', data.errcode, data.errmsg)
  }
}

module.exports = Wechat
