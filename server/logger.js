const winston = require('winston')
const config = require('config')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'noisedash' },
  transports: [
    new winston.transports.File({ filename: config.get('Server.logFile') }),
    new winston.transports.Console()
  ]
})

module.exports = logger
