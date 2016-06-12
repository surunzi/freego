var http = require('http');

var util = require('../lib/util');

module.exports = function ()
{
    return function *(next)
    {
        this.logger.info('forward request');

        var target = this.target,
            req = this.req;

        this.targetRes = yield request({
            port: target.port,
            hostname: target.ip,
            path: this.originalUrl,
            method: req.method,
            headers: req.headers
        }, this);

        if (this.targetRes.done) return;

        yield next;
    };

    function request(options, ctx)
    {
        return new Promise((resolve, reject) =>
        {
            var chunks = [];

            var proxyReq = http.request(options, (proxyRes) =>
            {
                var contentType = proxyRes.headers['content-type'];

                var html = util.isHtml(contentType),
                    json = isJson(contentType);

                // If the response is not html, we just pipe it back immediately.
                ctx.status = proxyRes.statusCode;
                if (!html && !json)
                {
                    util.each(proxyRes.headers, (val, key) => ctx.set(key, val));
                    proxyRes.pipe(ctx.res);
                    proxyRes.on('data', () => {});
                    proxyRes.on('end', () => {
                        ctx.res.end();
                        resolve({done: true});
                    });
                    return;
                }

                proxyRes.on('data', (chunk) => chunks.push(chunk));
                proxyRes.on('error', (err) => reject(err));
                proxyRes.on('end', () => resolve({
                    headers: proxyRes.headers,
                    done: false,
                    body: Buffer.concat(chunks)
                }));
            });

            proxyReq.on('error', (err) => reject(err));

            ctx.req.pipe(proxyReq);
        });
    }
};

var isJson = contentType => contentType && contentType.toLowerCase().indexOf('application/json') > -1;