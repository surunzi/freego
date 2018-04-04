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
        try {
            this.logger.info(`request url: ${decodeURIComponent(this.href)}`);
        } catch (e) {
            this.logger.info(`request url: ${this.href}`);
        }

        this.logger.info(`client ip: ${this.ip}`);

        this.target = getTarget(this);

        yield next;
    };

    function getTarget(ctx)
    {
        var href = ctx.href,
            cookies = ctx.cookies,
            targetValue = (cookies.get('free_go_proxy') || '');

        for (var i = 0; i < proxyLen; i++)
        {
            var p = proxy[proxyKeys[i]];

            if (p.pattern.test(href)) break;
        }

        if (i === proxyLen) return;

        var target = p.target[0];

        util.each(p.target, function (t) {
            if (t.value == targetValue) {
                target = t;
                return false;
            }
        })

        if (target.getIp && typeof target.getIp == 'function') {
            var ipInfo = target.getIp(ctx);
            target.ip = ipInfo.ip;
            target.port = ipInfo.port;
        }

        return util.extend({
            autoJump: p.autoJump,
            autoJumpUrl: p.autoJumpUrl || ctx.origin,
            domain: p.domain,
            path: p.path || '/',
            root: p
        }, target);
    }
};

const EXPIRES = 3600 * 24 * 30 * 1000;
const USER_ID_COOKIE_NAME = 'free_go_id';

var s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
var guid = () => s4() + s4();

var randomId = () => '' + (100000 + Math.floor(Math.random() * 900000));
