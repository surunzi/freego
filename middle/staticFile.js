var send = require('koa-send'),
    path = require('path');

var util = require('../lib/util');

var resolve = path.resolve;

const PUBLIC_PATH_MARK = '/free_go_proxy/public';

module.exports = function ()
{
    return function *(next)
    {
        var path = this.path;

        if (path.indexOf(PUBLIC_PATH_MARK) < 0) return yield next;

        path = util.last(path.split(PUBLIC_PATH_MARK));

        yield send(this, path, {
            root: resolve(__dirname, '../public')
        });
    };
};