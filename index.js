const Koa = require('koa')
const Router = require('koa-router')
const log4js = require('log4js')
const { PORT } = require('./config')
const { MQTTClient } = require('./mqtt')
const { MQTT: MQTTConf } = require('./config')
const log4jConfig = require('./config/log4j')
const handlers = require('./handlers')

log4js.configure(log4jConfig)

const logger = log4js.getLogger()

let mqttClient = null

const startMqtt = () => {
  mqttClient = new MQTTClient(MQTTConf, handlers)
  mqttClient.start()
}

startMqtt()

const app = new Koa()

app.on('error', err => {
  logger.error('server error', err)
})

const router = new Router()

router.get('/', (ctx, next) => {
  ctx.body = 'hello wrold'
})

router.get('/mqtt/status', (ctx, next) => {
  ctx.body = {
    connected: mqttClient.connected()
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(PORT, () => {
  logger.debug(`server started: http://localhost:${PORT}`)
})
