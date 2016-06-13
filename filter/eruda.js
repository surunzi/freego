var co = require('co');

var readTpl = require('../lib/readTpl');

module.exports = function ()
{
    return co.wrap(function *(headers, body)
    {
        var contentType = headers['content-type'],
            isHtml = contentType && contentType.indexOf('text/html') > -1;
        if (!isHtml) return {headers, body};

        var target = this.target,
            erudaTpl = yield readTpl('eruda');

        var injectStr = erudaTpl({
            target: JSON.stringify(target.root.target),
            id: this.id,
            domain: target.domain,
            userId: this.userId,
            path: target.path
        });

        body = body.replace('</body>', (match) => injectStr + match);

        return {headers, body};
    });
};