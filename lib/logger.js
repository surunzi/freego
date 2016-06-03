var log4js = require('log4js');

module.exports = function (path)
{
    if (path !== 'stdout') log4js.configure({
        appenders: [{
            type: "dateFile",
            filename: "freego.log",
            pattern: ".yyyyMMdd",
            maxLogSize: 1073741824,
            backups: 10,
            alwaysIncludePattern: false
        }]
    }, {cwd: path});

    var ret = log4js.getLogger('FreeGo');

    ret.create = function (id, userId)
    {
        return log4js.getLogger(`[FreeGo ${id} ${userId}]`);
    };

    return ret;
};