var ipFilter = require('ip-filter');

var readTpl = require('../lib/util');

module.exports = function (options)
{
    var ipPattern = options.ip;

    return function *(next)
    {
        var logger = this.logger;

        logger.info('user authentication');

        if (!ipFilter(this.ip, ipPattern, true))
        {
            logger.warn(`ip ${this.ip} is blocked`);

            this.status = 403;
            var tpl = yield readTpl('block');
            this.body = tpl({
                ip: this.ip,
                target: this.target
            });
            return;
        }

        yield next;
    };
};