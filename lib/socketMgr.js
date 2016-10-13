var logger = require('./logger');
var http   = require('http');
var io = require('socket.io')({
  path: '/free_go_proxy/socket'
});

var server = http.createServer();

io.initConfig = function (config) {

  logger = logger(config.logPath);

  server.listen(config.socketPort, config.bindAddress)
  io.listen(server);

  io.of('/free_go_proxy/socket').on('connection', (socket) => {
    logger.info(`capture client connected: ${socket.id}`);
    socket.on('addListener', (userId) => {
      logger.info(`socket id ${socket.id} add listen ${userId}`);
    })
    socket.on('disconnect', () => {
      logger.info(`capture client disconnected: ${socket.id}`);
    })
  })
}

module.exports = io;
