class Handler {
  // 是否需要处理，可以根据不同的消息类型进行区分
  check(message) {
    return false
  }

  handle(message) {
    // 具体处理过程，子类实现
  }
}

module.exports = Handler
