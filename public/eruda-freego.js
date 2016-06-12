(function (eruda)
{
    if (!eruda) return;

    var util = eruda.util;

    util.evalCss([
        '.eruda-freego {font-size: 14px; padding-bottom: 40px;}',
        '.eruda-main-wrapper {height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch;} ',
        'table {width: 100%; border-collapse: collapse; margin: 10px 0;}',
        'tr {margin: 10px 0; background: #fff; border: 1px solid #f2f2f2;}',
        'tr.active {background: #8de191; color: #fff;}',
        'td {padding: 10px;}',
        '.eruda-logout {background: #b4b4b4; text-align:center; padding: 10px; color: #fff;}',
        '.eruda-identifier-guid {width: 100%; margin-top: 10px; background: #76a2ee; color: #fff; text-align: center; position: absolute; left: 0; bottom: 0; height: 40px; line-height: 40px;}'
    ].join('.eruda-freego '));

    eruda.add({
        name: 'freego',
        init: function ($el)
        {
            this._$el = $el;
            this._proxy = freeGoProxy;
            this._identifier = freeGoIdentifier;
            this._guid = freeGoGuid;
            this._domain = freeGoDomain;
            this._path = freeGoPath;
            this._appendTpl();
            this._bindEvent();
        },
        show: function ()
        {
            this._$el.show();

            return this;
        },
        hide: function ()
        {
            this._$el.hide();

            return this;
        },
        _appendTpl: function ()
        {
            var tpl = '<div class="eruda-main-wrapper">';
            tpl += '<table><tbody>';

            var active = +(util.cookie.get('free_go_proxy') || 0);

            util.each(this._proxy, function (val, idx)
            {
                var activeClass = active === idx ? 'active' : '';

                tpl += '<tr class="eruda-proxy ' + activeClass + '" data-idx="' + idx + '">' +
                    '<td>' + val.name + '</td><td>' + val.ip + ':' + val.port + '</td>' +
                    '</tr>'
            });

            tpl += '</tbody></table>';
            tpl += '<div class="eruda-logout">Logout</div>';
            tpl += '</div>';

            tpl += '<div class="eruda-identifier-guid">ID: ' + this._identifier + ' GUID: ' + this._guid + '</div>';

            this._$el.html(tpl);
        },
        _bindEvent: function ()
        {
            var self = this;

            this._$el.on('click', 'tr', function ()
            {
                var idx = util.$(this).data('idx');

                util.cookie.set('free_go_proxy', idx, {
                    path: self._path,
                    domain: self._domain,
                    expires: 30
                });

                location.reload();
            }).on('click', '.eruda-logout', function ()
            {
                util.cookie.remove('free_go_proxy', {
                    path: self._path,
                    domain: self._domain
                });

                location.reload();
            });
        }
    }).show('freego');
})(eruda);