// Generate request and user id, init logger.

var util = require('../lib/util');

module.exports = function (options)
{
    var logger = options.logger,
        proxy = options.proxy,
        proxyKeys = util.keys(proxy),
        proxyLen = proxyKeys.length;

    return function *(next)
    {
        var userId = this.cookies.get(USER_ID_COOKIE_NAME);

        if (!userId)
        {
            userId = randomId();
            this.cookies.set(USER_ID_COOKIE_NAME, userId, {
                httpOnly: true,
                expires: new Date(Date.now() + EXPIRES)
            });
        }

        this.userId = userId;
        this.id = guid();

        this.logger = logger.create(this.id, userId);
        this.logger.info(`request url: ${decodeURIComponent(this.href)}`);

        this.logger.info(`client ip: ${this.ip}`);

        this.target = getTarget(this);

        yield next;
    };

    function getTarget(ctx)
    {
        var href = ctx.href,
            cookies = ctx.cookies,
            index = +(cookies.get('free_go_proxy') || 0);

        for (var i = 0; i < proxyLen; i++)
        {
            var p = proxy[proxyKeys[i]];

            if (p.pattern.test(href)) break;
        }

        if (i === proxyLen) return;

        var target = p.target[index] || p.target[0];

        return {
            ip: target.ip,
            name: target.name,
            port: target.port,
            domain: p.domain || ctx.host,
            path: p.path || '/',
            root: p
        };
    }
};

const EXPIRES = 3600 * 24 * 30 * 1000;
const USER_ID_COOKIE_NAME = 'free_go_id';

var s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
var guid = () => s4() + s4();

var randomId = () => '' + (100000 + Math.floor(Math.random() * 900000));
