# mqtt-wechat

监听并转发 mqtt 消息到企业微信，可用于 IoT 设备通知。

### 准备工作

1. 可用的 mqtt server，自建或蹭别人的
2. 可用的企业微信应用（支持个人申请） [官方文档](https://work.weixin.qq.com/api/doc/90000/90003/90556)

### 配置

在 config/index.js 中配置 mqtt server 和企业微信。

### 运行

需要服务器 nodejs 环境。

```
// 安装依赖
yarn

// 运行
yarn start

// 访问，端口号可以在 config 文件中配置，也可以在环境变量中增加: PORT=xxx
// http://localhost:9999

// 查看 mqtt 连接状态是否正常
// http://localhost:9999/mqtt/status
```
