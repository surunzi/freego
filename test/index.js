const freeGo = require('../index');

freeGo({
    port: 13191,
    processTitle: 'localhostProxy',
    proxy: {
        localhostDean: {
            pattern: /http:\/\/localhost:13191\/dean/,
            path: '/dean',
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
            pattern: /http:\/\/localhost:13191\/sam/,
            path: '/sam',
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