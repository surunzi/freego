const http = require('http');

const TEST_SERVER = [
    {
        name: 'dean',
        ports: [13192, 13193, 13194]
    },
    {
        name: 'sam',
        ports: [13195, 13196]
    }
];

function createServer(name, port)
{
    http.createServer(function (req, res)
    {
        var url = 'http://' + req.headers['host'] + req.url;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>FreeGo</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
                </head>
                <body>
                    This is ${name} at ${port}, url: ${url}.
                </body>
            </html>
        `);
    }).listen(port, function ()
    {
        console.log(`Server ${name} listening on: http://localhost: ${port}`);
    });
}

TEST_SERVER.forEach(server =>
{
    server.ports.forEach(port => createServer(server.name, port));
});