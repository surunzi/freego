var co = require('co'),
    fs = require('fs'),
    handlebars = require('handlebars');

var readTpl = require('../lib/readTpl'),
    util = require('../lib/util'),
    ungzip = require('../lib/ungzip');

module.exports = function ()
{
    return function *(next)
    {
        this.logger.info('Process response');

        var targetRes = this.targetRes,
            headers = targetRes.headers,
            body = targetRes.body;

        this.resultRes = {
            headers: headers,
            body: body
        };

        var isHtml = util.isHtml(headers['content-type']);

        if (!isHtml) return yield next;

        yield injectEruda({
            resultRes: this.resultRes,
            target: this.target,
            id: this.id,
            guid: this.guid
        });

        yield next;
    };
};

var injectEruda = co.wrap(function *injectEruda(options)
{
    var resultRes = options.resultRes,
        target = options.target,
        headers = resultRes.headers,
        body = resultRes.body;

    if (headers['content-encoding'] === 'gzip')
    {
        delete headers['content-encoding'];
        body = yield ungzip(body);
    }
    body = String(body);

    var injectStr = '';

    var erudaTpl = yield readTpl('eruda');
    injectStr += erudaTpl({
        target: JSON.stringify(target.root.target),
        id: options.id,
        domain: target.domain,
        guid: options.guid,
        path: target.path
    });

    body = body.replace('</body>', (match) => injectStr + match);

    resultRes.body = body;
});
