const log4js = require('log4js')
const Handler = require('../Handler')
const WeChat = require('../../wechat')
const { WECHAT } = require('../../config')

const logger = log4js.getLogger()

class WechatHandler extends Handler {
  constructor() {
    super()
    this.client = new WeChat(WECHAT)
  }

  check(topic) {
    logger.log('check topic', topic)
    return topic.startsWith('qtx/home')
  }

  handle({ message }) {
    this.client.sendText({
      users: '@all',
      message
    })
  }
}

module.exports = WechatHandler

