var readTpl = require('../lib/readTpl');

module.exports = function (customRouters)
{
    var router = require('koa-router')();

    router.get('*/free_go_proxy', function *()
    {
        var target = this.target;

        var tpl = yield readTpl('freego');
        this.body = tpl({target, targets: JSON.stringify(target.root.target)});
    });

    router.get('*/freego_capture', function *()
    {
        var target = this.target;

        var tpl = yield readTpl('freego_capture');
        this.body = tpl({target});
    });

    if (customRouters && typeof customRouters == 'function')
    {
        customRouters(router);
    }

    return router.routes();
};
