(function (eruda)
{
    if (!eruda) return;

    var util = eruda.util;

    util.evalCss([
        '.eruda-freego {font-size: 14px; padding-bottom: 40px;}',
        '.eruda-main-wrapper {height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 40px;} ',
        '.eruda-table-wrapper {margin: 20px 10px; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .05), 0 1px 4px 0 rgba(0, 0, 0, .08), 0 3px 1px -2px rgba(0, 0, 0, .2);}',
        'table {width: 100%; border-collapse: collapse; margin: 0;}',
        'tr {margin: 10px 0; background: #fff; transition: background .3s, color .3s; cursor: pointer;}',
        'tr.active,',
        'tr:active {background: #02B4A9; color: #fff;}',
        'td {padding: 10px;}',
        '.eruda-logout {border-top: 1px solid #ebebeb; background: #d55; text-align:center; padding: 10px; color: #fff; transition: background .3s, color .3s; cursor: pointer;}',
        '.eruda-logout:active {background: #aa4240; color: #fff;}',
        '.eruda-id {width: 100%; margin-top: 10px; background: #d55; color: #fff; text-align: center; position: absolute; left: 0; bottom: 0; height: 40px; line-height: 40px;}'
    ].join('.eruda-freego '));

    eruda.add({
        name: 'freego',
        init: function ($el)
        {
            this._$el = $el;
            this._target = freeGoTarget;
            this._id = freeGoId;
            this._userId = freeGoUserId;
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
            var tpl = '<div class="eruda-main-wrapper"><div class="eruda-table-wrapper">';
            tpl += '<table><tbody>';

            var active = +(util.cookie.get('free_go_proxy') || 0);

            util.each(this._target, function (val, idx)
            {
                var activeClass = active === idx ? 'active' : '';

                tpl += '<tr class="eruda-proxy ' + activeClass + '" data-idx="' + idx + '" ontouchstart>' +
                    '<td>' + val.name + '</td><td>' + val.ip + ':' + val.port + '</td>' +
                    '</tr>'
            });

            tpl += '</tbody></table>';
            tpl += '<div class="eruda-logout" ontouchstart>Log out</div>';
            tpl += '</div></div>';

            tpl += '<div class="eruda-id">ID: ' + this._id + ' USER: ' + this._userId + '</div>';

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