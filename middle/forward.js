var http = require('http');

var io = require('../lib/socketMgr');
var util = require('../lib/util');

var MAX_DISPLAY_RES_CONTENT_LENGTH = 500 * 1024;

module.exports = function (options)
{
    var filterType = options.filterType,
        forwardId = options.forwardId;

    return function *(next)
    {
        var target = this.target,
            req = this.req,
            path = this.originalUrl;

        this.logger.info(`forward address: ${target.ip}:${target.port}(${target.name})`);

        if (forwardId) path = util.addQuery(path, 'freego', this.id);

        // remove cache headers for test
        var filterHeaders = util.defaults({}, req.headers);
        delete filterHeaders['if-match']
        delete filterHeaders['if-none-match']
        delete filterHeaders['if-modified-since']
        delete filterHeaders['if-unmodified-since']

        if (target.customHeader) {
            filterHeaders = target.customHeader(filterHeaders, this);
        }

        this.targetRes = yield request.call(this, {
            port: target.port,
            hostname: target.ip,
            method: req.method,
            headers: filterHeaders,
            path
        });

        if (this.targetRes.done) return;

        yield next;
    };

    function request(options)
    {
        return new Promise((resolve, reject) =>
        {
            var chunks = [];
            var userId = this.userId;
            var resContentType;

            var proxyReq = http.request(options, (proxyRes) =>
            {
                resContentType = proxyRes.headers['content-type'];

                // If the response is not html, we just pipe it back immediately.
                this.status = proxyRes.statusCode;

                proxyRes.on('end', () => {
                  var {headers, statusCode} = proxyRes;
                  var body = '/**display text or json only**/';

                  if (/^text|application\/json/.test(resContentType)) {
                    body = Buffer.concat(chunks).toString();
                  }

                  io.of('/free_go_proxy/socket').emit(userId, {
                    eventType: 'remoteResponse',
                    requestId: this.id,
                    res: {headers, statusCode, body}
                  })
                });

                var pipeBackImmediately = !(resContentType && filterType.some(val => resContentType.indexOf(val) > -1));
                if (pipeBackImmediately) {
                    util.each(proxyRes.headers, (val, key) => this.set(key, val));
                    proxyRes.pipe(this.res);
                    proxyRes.on('data', () => {});
                    proxyRes.on('end', () => {
                      this.res.end();
                      resolve({done: true});
                    });
                    return;
                }

                proxyRes.on('data', (chunk) => chunks.push(chunk));
                proxyRes.on('error', (err) => reject(err));
                proxyRes.on('end', () => {
                  resolve({
                    headers: proxyRes.headers,
                    done: false,
                    body: Buffer.concat(chunks)
                  })
                });
            });

            if (this.req.method === 'POST')
            {
                var body = [];
                this.req
                    .on('data', chunk => body.push(chunk))
                    .on('end', () => {
                        body = Buffer.concat(body).toString();
                        if (body.trim() !== '') this.reqBody = `\n${body}\n`;
                    });
            }

            proxyReq.on('socket', (socket) => {
              var responseRaw = [];
              socket.on('data', (data) => {
                responseRaw.push(data);
              });

              socket.on('close', () => {
                var rawRes = filterRawBody(filterCaptureType(resContentType, Buffer.concat(responseRaw).toString()));

                io.of('/free_go_proxy/socket').emit(userId, {
                  eventType: 'remoteResponse',
                  requestId: this.id,
                  rawRes: rawRes
                });
              })
            })

            this.req.on('end', () => {
              var {headers, method, url, originalurl, href, path, querystring, host, query, protocol, ip, cookie} = this.request;
              var rawReq = this.req.socket.originalRequest.toString();

              if (this.req.method === 'POST') {
                rawReq = filterRawBody(filterCaptureType(this.req.headers['content-type'], rawReq));
              }

              io.of('/free_go_proxy/socket').emit(userId, {
                eventType: 'originalRequest',
                requestId: this.id,
                targetIP: this.target.ip,
                targetName: this.target.name,
                req: {headers, method, url, originalurl, href, path, querystring, host, query, protocol, ip},
                rawReq: rawReq
              });
            })

            proxyReq.on('error', (err) => reject(err));
            this.req.pipe(proxyReq);
        });
    }
};

// display text only in raw, other types take a long time to render in html
// TODO: supporting display some media types in browser, such as image
function filterCaptureType(type, body) {
  if (/^text|application\/json|application\/x-www-form-urlencoded|application\/javascript/.test(type)) {
    return body;
  } else {
    return [body.split('\r\n\r\n')[0], `\r\n\r\n/**WARNING: Content-Type ${type} will not display here**/`].join('');
  }
}

function filterRawBody(body) {
  if (body.length >= MAX_DISPLAY_RES_CONTENT_LENGTH) {
    return [body.split('\r\n\r\n')[0], '\r\n\r\n/**WARNING: body is to large to display**/'].join('');
  }
  return body;
}
