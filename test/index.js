const freeGo = require('../index');

freeGo({
    port: 80,
    processTitle: 'localhostProxy',
    proxy: {
        localhost: {
            pattern: /http:\/\/localhost\/favicon.ico/,
            target: [
                {
                    name: 'localhost',
                    ip: '127.0.0.1',
                    port: 13192
                }
            ]
        },
        localhostDean: {
            pattern: /http:\/\/localhost\/dean\//,
            path: '/dean/',
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
        localhostSam: {
            pattern: /http:\/\/localhost\/sam\//,
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