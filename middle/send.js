var util = require('../lib/util');

module .exports = function ()
{
    return function *(next)
    {
        this.logger.info('Send response');

        var resultRes = this.resultRes;

        util.each(resultRes.headers, (val, key) => this.set(key, val));

        this.body = resultRes.body;
        yield next;
    };
};