var koa = require('koa'),
    path = require('path'),
    error = require('koa-error'),
    net = require('net');

var init = require('./middle/init'),
    resTime = require('./middle/resTime'),
    staticFile = require('./middle/static'),
    router = require('./middle/router'),
    auth = require('./middle/auth'),
    forward = require('./middle/forward'),
    filter = require('./middle/filter'),
    send = require('./middle/send'),
    save = require('./middle/save'),
    logger = require('./lib/logger'),
    util = require('./lib/util'),
    defCfg = require('./config');

var noopGenFunc = function* (next) {
  yield next;
}

module.exports = function (config)
{
    util.defaults(config, defCfg);

    logger = logger(config.logPath);

    var app = koa();

    app.proxy = true;
    app.use(error({
           template: path.resolve(__dirname, 'tpl/error.html')
       }))
       .use(init({
           proxy: config.proxy,
           logger,
           injectTpl: config.injectTpl
       }))
       .use(config.afterInit || noopGenFunc)
       .use(resTime())
       .use(staticFile())
       .use(router(config.routers))
       .use(auth({
           custom: config.check,
           ip: config.ip,
           password: config.password
       }))
       .use(config.beforeForward || noopGenFunc)
       .use(forward({
           filterType: config.filterType,
           forwardId: config.forwardId,
           customHeader: config.customHeader
       }))
       .use(filter({
           filter: config.filter
       }))
       .use(config.afterForward || noopGenFunc)
       .use(send())
       .use(save({
           logPath: config.logPath
       }));

    var httpServer = app.listen(config.port, config.bindAddress);

    var io = require('./lib/socketMgr');
    io.initConfig(config);

    httpServer.on('connection', (socket) => {
      socket.on('data', (data) => {

        if (socket.originalRequest) {
          socket.originalRequest = Buffer.concat([socket.originalRequest, data]);
        } else {
          socket.originalRequest = data;
        }
      });
    })

    logger.info(`listening on port: ${config.port}`);

    app.updateProxies = function (proxyConfig) {
        util.extend(config.proxy, proxyConfig)
    }

    return app;
};
