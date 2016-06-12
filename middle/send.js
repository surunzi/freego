var util = require('../lib/util');

module .exports = function ()
{
    return function *(next)
    {
        this.logger.info('Send response');

        var resultRes = this.resultRes;

        util.each(resultRes.headers, (val, key) => this.set(key, val));

        // Disable cache
        this.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        this.set('Pragma', 'no-cache');
        this.set('Expires', '0');

        this.body = resultRes.body;
        yield next;
    };
};