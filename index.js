var koa = require('koa'),
    path = require('path'),
    error = require('koa-error');

var init = require('./middle/init'),
    logger = require('./lib/logger'),
    util = require('./lib/util'),
    defCfg = require('./config');

module.exports = function (config)
{
    util.defaults(config, defCfg);

    logger = logger(config.logPath);

    var app = koa();

    app.use(error({
           template: path.resolve(__dirname, 'tpl/error.html')
       }))
       .use(init({logger}))
       .listen(config.port);

    logger.info(`listening on port: ${config.port}`);
};