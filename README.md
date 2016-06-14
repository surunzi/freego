# FreeGo

FreeGo is a node.js http proxy for redirecting requests to different targeted
servers via cookies, especially suitable for mobile hosts quick switching.

## Benefits

* Switch environment between testing server and other servers quickly.
* Inject [eruda](https://github.com/liriliri/eruda) to html page for mobile
  client side debugging.
* Save whole http request for html and json response.

## Installation

```bash
npm install freego --save
```

## Usage

```javascript
var freego = require('freego');

freego({
    // Configurations
    proxy: {
        freeGo: {
            pattern: /http:\/\/freego.com\//,
            target: [
                {
                    name: 'Testing',
                    ip: '127.0.0.1',
                    port: '80'
                }
                // List of servers
            ]
        }
    }
});
```

You need to do a little server configuration staff before using FreeGo. If
you're using nginx, add rules to make sure it send requests to FreeGo if url or
cookie contains **"free_go_proxy"**. It might look like something below:

```
location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://$myserver;
}

location /free_go_proxy {
    proxy_set_header Host $host;
    ...
    proxy_pass http://freegoproxy;
}

map $COOKIE_free_go_proxy $myserver {
    ~* freegoproxy;
    default myserver;
}

upstream freegoproxy {
    # FreeGo server
    server 127.0.0.1:13191;
}

upstream myserver {
    server 127.0.0.1:13192;
}
```

After that, navigate `http://xxx/free_go_proxy` to enable freeGo for all pages.
If a little icon appears in the right bottom corner of the page, it is
successfully done.

## Configurations

* port: Server port, default to 3000.
* logPath: Log path, also path for saving http requests.
* ip: Ip list to allow access, see [ip-filter](https://github.com/tunnckocore/ip-filter).
* filterType: Response type to save requests, html and json only by default.
* filter: Filters for response content processing.
* password: Password to bypass ip filter, false to turn it off.
* proxy: Proxy setting for different sites, see
  [test/index.js](https://github.com/surunzi/freego/blob/master/test/index.js) as an example.

## License

FreeGo is released under the MIT license. Please see
[LICENSE](https://opensource.org/licenses/MIT) for full details.
