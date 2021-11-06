const mqtt = require('mqtt')
const log4js = require('log4js')

const logger = log4js.getLogger()

class MQTTClient {
  constructor(config, handlers) {
    this.config = config
    this.handlers = handlers
    this.client = null
  }

  start({ topic } = {}) {
    const { host, port, username, password, clientId } = this.config
    const client  = mqtt.connect(`mqtt://${host}:${port}`, {
      username,
      password,
      clientId
    })

    client.on('connect', () => {
      logger.log('mqtt connected !')
      client.subscribe(topic || this.config.topic, (err) => {
        if (!err) {
          logger.log('mqtt ready !')
        }
      })
    })

    client.on('message', (topic, message) => {
      // message is Buffer
      logger.log(`mqtt received: ${message.toString()}`)
      if (this.handlers && this.handlers.length > 0) {
        this.handlers.forEach((handler) => {
          if (handler.check(topic)) {
            handler.handle({ topic, message: message.toString() })
          }
        })
      }
    })

    client.on('error', (err) => {
      // message is Buffer
      logger.error('[mqtt] 连接失败')
      logger.error(err)
    })

    this.client = client
  }

  stop() {
    if (this.client) {
      this.client.end()
    }
  }

  publish({ topic, message }) {
    if (!this.client) {
      return
    }

    topic = topic || this.config.topic
    this.client.publish(topic, message)
  }

  connected() {
    if (!this.client) {
      return false
    }

    return this.client.connected
  }
}

module.exports = {
  MQTTClient
}
