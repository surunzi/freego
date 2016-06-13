var path = require('path'),
    fs = require('co-fs');

var util = require('../lib/util'),
    readTpl = require('../lib/readTpl'),
    mkdirp = require('../lib/mkdirp');

module.exports = function (options)
{
    var logPath = options.logPath;

    return function *(next)
    {
        yield* next;

        if (logPath === 'stdout') return;

        this.logger.info('Save result');

        var resultRes = this.resultRes;

        var httpTpl = yield readTpl('http');
        var data = httpTpl({
            method: this.method,
            href: this.href,
            protocol: this.protocol.toUpperCase(),
            reqHeaders: this.req.headers,
            reqBody: this.reqBody,
            status: this.status,
            resHeaders: resultRes.headers,
            resBody: resultRes.body
        });

        var saveDir = path.resolve(logPath, getDate());
        yield mkdirp(saveDir);

        var savePath = path.resolve(saveDir, this.id + '.txt');
        yield fs.writeFile(savePath, data);

        this.logger.info(`request is saved to ${savePath}`);
    };
};

var padZero = num => num < 10 ? '0' + num : num;

function getDate()
{
    var date = new Date();
    return date.getFullYear() + padZero(date.getMonth() + 1) + padZero(date.getDate());
}