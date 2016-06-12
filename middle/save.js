var path = require('path'),
    fs = require('co-fs');

var util = require('../lib/util'),
    mkdirp = require('../lib/mkdirp');

module.exports = function (options)
{
    var logPath = options.logPath;

    return function *(next)
    {
        yield* next;

        this.logger.info('Save result');

        var data = '';

        var resultRes = this.resultRes,
            protocol = this.protocol.toUpperCase();

        data += this.method + ' ' + this.href + ' ' + protocol + '\n';
        util.each(this.req.headers, (val, key) => data += key + ': ' + val + '\n');

        data += '\n' + protocol + ' ' + this.status + '\n';
        util.each(resultRes.headers, (val, key) => data += key + ': ' + val + '\n');

        data += '\n' + resultRes.body;

        var saveDir = path.resolve(logPath, getDate());
        yield mkdirp(saveDir);

        var savePath = path.resolve(saveDir, this.guid + '.txt');
        yield fs.writeFile(savePath, data);

        this.logger.info('request is saved to ' + savePath);
    };
};

var padZero = num => num < 10 ? '0' + num : num;

function getDate()
{
    var date = new Date();
    return date.getFullYear() + padZero(date.getMonth() + 1) + padZero(date.getDate());
}