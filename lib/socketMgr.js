var logger = require('./logger');

var io = require('socket.io')({
  path: '/free_go_proxy/socket'
});

io.initConfig = function (config) {

  logger = logger(config.logPath);

  io.listen(config.socketPort);

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
