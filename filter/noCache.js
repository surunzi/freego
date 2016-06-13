var co = require('co');

module.exports = function ()
{
    return co.wrap(function *(headers, body)
    {
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';

        return {headers, body};
    });
};