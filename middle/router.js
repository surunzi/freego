var readTpl = require('../lib/readTpl');

module.exports = function ()
{
    var router = require('koa-router')();

    router.get('*/free_go_proxy', function *()
    {
        var target = this.target;

        var tpl = yield readTpl('freego');
        this.body = tpl({target});
    });

    return router.routes();
};