// Generate request and user id, init logger.

var util = require('../lib/util');

module.exports = function (options)
{
    var logger = options.logger;

    return function *(next)
    {
        var userId = this.cookies.get(USER_ID_COOKIE_NAME);

        if (!userId)
        {
            userId = util.randomId();
            this.cookies.set(USER_ID_COOKIE_NAME, {
                httpOnly: true,
                expires: new Date(Date.now() + EXPIRES)
            });
        }

        this.userId = userId;
        this.id = util.guid();
        this.logger = logger.create(this.id, userId);
        this.logger.info('Request url: ' + decodeURIComponent(this.href));

        yield next;
    };
};

const EXPIRES = 3600 * 24 * 30 * 1000;
const USER_ID_COOKIE_NAME = 'freego_id';