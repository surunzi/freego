var zlib = require('zlib');

module.exports = function (buffer)
{
    return new Promise((resolve, reject) =>
    {
        zlib.gunzip(buffer, (err, data) =>
        {
            if (err) return reject(err);

            resolve(data);
        });
    });
};