var ipFilter = require('ip-filter');

var readTpl = require('../lib/readTpl');

module.exports = function (options)
{
    var ipPattern = options.ip,
        password = options.password;

    return function *(next)
    {
        if (!this.target)
        {
            this.cookies.set('free_go_proxy');
            this.status = 302;
            return this.set('location', this.href);
        }

        var logger = this.logger;

        var ipNotAllowed = !ipFilter(this.ip, ipPattern, true),
            noCorrectPass = !(password && this.cookies.get('free_go_password') === password);

        if (ipNotAllowed && noCorrectPass)
        {
            logger.warn(`ip ${this.ip} is blocked`);

            this.status = 403;
            var tpl = yield readTpl('block');
            this.body = tpl({
                ip: this.ip,
                target: this.target,
                password: password
            });
            return;
        }

        yield next;
    };
};