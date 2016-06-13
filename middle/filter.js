module.exports = function (options)
{
    var filter = options.filter;

    return function *(next)
    {
        this.logger.info('filter response');

        var targetRes = this.targetRes,
            headers = targetRes.headers,
            body = targetRes.body;

        for (var i = 0, len = filter.length; i < len; i++)
        {
            var ret = yield filter[i].call(this, headers, body);

            headers = ret.headers;
            body = ret.body;
        }

        this.resultRes = {
            headers: headers,
            body: body
        };

        yield next;
    };
};
