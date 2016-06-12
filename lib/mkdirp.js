var mkdirp = require('mkdirp');

module.exports = function (path)
{
    return new Promise(function (resolve, reject)
    {
        mkdirp(path, function (err)
        {
            if (err) return reject(err);

            resolve();
        })
    });
};