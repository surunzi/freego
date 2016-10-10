var freeGo = require('../index'),
    path = require('path');

freeGo({
    port: 13191,
    socketPort: 13252,
    logPath: path.resolve(__dirname, '../log'),
    password: 'freego',
    forwardId: true,
    ip: ['127.0.0.1'],
    proxy: {
        freeGo: {
            pattern: /http:\/\/freego\.oa\.com\/favicon.ico/,
            target: [
                {
                    name: 'localhost',
                    ip: '127.0.0.1',
                    port: 13192
                }
            ]
        },
        freeGoDean: {
            pattern: /http:\/\/freego\.oa\.com\/dean\//,
            path: '/dean/',
            autoJump: true,
            target: [
                {
                    name: 'DeanOne',
                    ip: '127.0.0.1',
                    port: 13192
                },
                {
                    name: 'DeanTwo',
                    ip: '127.0.0.1',
                    port: 13193
                },
                {
                    name: 'DeanThree',
                    ip: '127.0.0.1',
                    port: 13194
                }
            ]
        },
        freeGoSam: {
            pattern: /http:\/\/freego\.oa\.com\/sam\//,
            path: '/sam/',
            target: [
                {
                    name: 'SamOne',
                    ip: '127.0.0.1',
                    port: 13195
                },
                {
                    name: 'SamTwo',
                    ip: '127.0.0.1',
                    port: 13196
                }
            ]
        }
    }
});