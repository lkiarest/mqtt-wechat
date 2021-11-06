module.exports = {
  appenders: {
    'STDOUT': {
      type: 'stdout'
    },
    'FILE_ALL': {
      type: 'file',
      filename: 'log/all.log',
      maxLogSize: 10485760,
      backups: 10
    }
  },
  categories: {
    default: {
      appenders: ['STDOUT', 'FILE_ALL'],
      level: 'debug'
    }
  }
}
