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
        res.end(`This is ${name} at ${port}.`);
    }).listen(port, function ()
    {
        console.log(`Server ${name} listening on: http://localhost: ${port}`);
    });
}

TEST_SERVER.forEach(server =>
{
    server.ports.forEach(port => createServer(server.name, port));
});