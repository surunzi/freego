var zlib = require('zlib'),
    co = require('co');

module.exports = function ()
{
    return co.wrap(function *(headers, body)
    {
        if (headers['content-encoding'] !== 'gzip')
        {
            body = String(body);
            return {headers, body};
        }

        delete headers['content-encoding'];
        body = String(yield ungzip(body));

        return {headers, body};
    });
};

function ungzip(buffer)
{
    return new Promise((resolve, reject) =>
    {
        zlib.gunzip(buffer, (err, data) =>
        {
            if (err) return reject(err);

            resolve(data);
        });
    });
}