var path = require('path');

var ungzip = require('./filter/ungzip'),
    eruda = require('./filter/eruda'),
    noCache = require('./filter/noCache');

module.exports = {
    port: 3000,
    logPath: 'stdout',
    filterType: ['text/html', 'application/json'],
    filter: [
        ungzip(),
        eruda(),
        noCache()
    ],
    ip: ['*'],
    password: false,
    proxy: {}
};