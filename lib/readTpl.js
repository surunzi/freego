var fs = require('fs'),
    path = require('path'),
    handlebars = require('handlebars');

const TPL_PATH = path.resolve(__dirname, '../tpl');

var cache = {};

handlebars.registerHelper('raw', function(options) {
  return options.fn();
});

module.exports = function (name)
{
    return new Promise((resolve, reject) =>
    {
        var tpl = cache[name];

        if (tpl) return process.nextTick(() => resolve(tpl));

        fs.readFile(path.resolve(TPL_PATH, name + '.hbs'), 'utf-8', (err, data) =>
        {
            if (err) return reject(err);

            // tpl = cache[name] = handlebars.compile(data);
            tpl = handlebars.compile(data);

            resolve(tpl);
        });
    });
};
