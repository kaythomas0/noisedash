#!/usr/bin/env node

const app = require('../app')
const fs = require('fs')
const config = require('config')
const tls = config.get('Server.tls')
const http = require(tls ? 'https' : 'http')
const logger = require('../logger')

const port = normalizePort(config.get('Server.listeningPort'))
app.set('port', port)

let server = http.createServer(app)
if (tls) {
  const httpsOptions = {
    key: fs.readFileSync(config.get('Server.tlsKey')),
    cert: fs.readFileSync(config.get('Server.tlsCert'))
  }

  server = http.createServer(httpsOptions, app)
}

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(new Error(bind + ' requires elevated privileges'))
      process.exit(1)
    case 'EADDRINUSE':
      logger.error(new Error(bind + ' is already in use'))
      process.exit(1)
    default:
      throw error
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  logger.log('info', 'Listening on %s', bind)
  logger.log('info', 'WARNING, IMPORTANT: It looks like you are using the kevinthomas0/noisedash docker image. Please update your image to noisedash/noisedash. The kevinthomas0/noisedash image will no longer receive updates.')
}
