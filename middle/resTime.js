var util = require('../lib/util');

module.exports = function ()
{
    return function *(next)
    {
        var start = util.now();
        yield next;
        var ms = util.now() - start;

        this.logger.info(`response time: ${ms}ms`);
    };
};