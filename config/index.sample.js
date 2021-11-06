const PORT = process.env.PORT || 9999

// mqtt 配置
const MQTT = {
  host: '127.0.0.1',
  port: '1883',
  username: 'test',
  password: 'test',
  topic: 'test/#',
  clientId: 'test-uniqueid'
}

// 企业微信配置
const WECHAT = {
  agentId: '1',
  corpId: 'yourcorpid',
  secret: 'yourcorpsecret'
}

module.exports = {
  PORT,
  MQTT,
  WECHAT
}
