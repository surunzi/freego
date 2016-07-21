var $ = _["$"];
var socket = io.connect('http://freego.oa.com/free_go_proxy/socket', { path: '/free_go_proxy/socket' });

function addListenUser(userId) {
  socket.emit('addListener', userId);

  function onOriginalRequest(data) {
    console.log('request', data.requestId);
    var requests = captureList.$data.requests;
    var requestsMap = captureList.$data.requestsMap;
    requests.$set(requests.length, data);
    requestsMap[data.requestId] = requests.length - 1;
  }

  function onRemoteResponse(data) {
    var requests = captureList.$data.requests;
    var requestsMap = captureList.$data.requestsMap;
    var requestIndex = requestsMap[data.requestId];
    if (requestIndex >= 0 && requests[requestIndex]) {
      requests.$set(requestIndex, _.extend({}, requests[requestIndex], data));
      if (captureList.$data.currentDetail.requestId == data.requestId) {

      }
    }
  }

  socket.on(userId, function(data) {
    data.userId = userId;
    switch (data.eventType) {
      case 'originalRequest': onOriginalRequest(data);break;
      case 'remoteResponse' : onRemoteResponse(data);break;
    }
  })
}

function removeListenUser(userId) {
  socket.removeListener(userId);
}

socket.on('connect', function() {
  // addListenUser('227118')
})

var RequestItemComponent = Vue.extend({
  props: ['data'],
  template: $('#request-item-component-template').html(),
  methods: {
    onSelect: function (data) {
      if (!$(this.$el).hasClass('freego_capture_item_selected')) {
        var reqHeaders = [];
        var resHeaders = [];
        var queryArray = [];
        var cookies = [];

        if (!data.reqHeaders) {
          for (name in data.req.headers) {
            if (name.toLowerCase() == 'cookie') {
              var tmpCookie = data.req.headers[name].split('; ');
              _.each(tmpCookie, function (cookieItem) {
                var cookieItemArr = cookieItem.split('=')
                var cookieName = cookieItemArr.shift();
                var cookieValue = cookieItemArr.join('=');
                cookies.push({
                  name: cookieName,
                  value: cookieValue
                });
              });
            }
            if (_.isArr(data.req.headers[name])) {
              _.each(data.req.headers[name], function(value) {
                reqHeaders.push({
                  name: name.replace(/^[a-z]|\-[a-z]/g, function(a) {
                    return a.toUpperCase();
                  }),
                  value: value
                })
              })
            } else {
              reqHeaders.push({
                name: name.replace(/^[a-z]|\-[a-z]/g, function(a) {
                  return a.toUpperCase();
                }),
                value: data.req.headers[name]
              })
            }
          }
          Vue.set(data, 'reqHeaders', reqHeaders);
          Vue.set(data, 'cookiesArray', cookies);
        }

        if (!data.queryArray) {
          for (name in data.req.query) {
            queryArray.push({
              name: name,
              value: data.req.query[name]
            })
          }
          Vue.set(data, 'queryArray', queryArray);
        }

        if (data.res && !data.resHeaders) {
          for (name in data.res.headers) {
            if (_.isArr(data.res.headers[name])) {
              _.each(data.res.headers[name], function(value) {
                resHeaders.push({
                  name: name.replace(/^[a-z]|\-[a-z]/g, function(a) {
                    return a.toUpperCase();
                  }),
                  value: value
                })
              })
            } else {
              resHeaders.push({
                name: name.replace(/^[a-z]|\-[a-z]/g, function(token) {
                  return token.toUpperCase();
                }),
                value: data.res.headers[name]
              })
            }
          }
          Vue.set(data, 'resHeaders', resHeaders);

          if (/application\/json/.test(data.res.headers['content-type'])) {
            Vue.set(data, 'resJSON', JSON.stringify(JSON.parse(data.res.body), null, 2));
          }
        }

        $('.freego_capture_item_selected').rmClass('freego_capture_item_selected');
        $(this.$el).addClass('freego_capture_item_selected');
        this.$dispatch('requestSelect', data);
      }
    }
  }
});

var RequestDetailComponent = Vue.extend({
  props: ['data'],
  methods: {
    switchTab: function (type, scope, event) {
      if (type == 'req') {
        $('.freego_capture_detail_request_wrap .freego_capture_detail_tab').hide();
        $('.freego_capture_detail_request_wrap [data-view-scope=' + scope + ']').show();

        $('.freego_capture_detail_request_wrap .freego_proxy_detail_button').rmClass('freego_proxy_detail_button_selected');
        $(event.currentTarget).addClass('freego_proxy_detail_button_selected');
      } else {
        $('.freego_capture_detail_response_wrap .freego_capture_detail_tab').hide();
        $('.freego_capture_detail_response_wrap [data-view-scope=' + scope + ']').show();

        $('.freego_capture_detail_response_wrap .freego_proxy_detail_button').rmClass('freego_proxy_detail_button_selected');
        $(event.currentTarget).addClass('freego_proxy_detail_button_selected');
      }
    }
  },
  template: $('#request-detail-component-template').html()
});

var userIds = (window.localStorage && window.localStorage.getItem('listenUserIds')) ? window.localStorage.getItem('listenUserIds').split(',') : [];

var captureList = new Vue({
  el: '#freego_capture',
  data: {
    requests: [],
    requestsMap: {},
    currentDetail: {},
    userIds: userIds
  },
  components: {
    'request-component': RequestItemComponent,
    'request-detail': RequestDetailComponent
  },
  events: {
    requestSelect: function (data) {
      this.$set('currentDetail', data);
    }
  },
  methods: {
    addListenUser: function () {
      var userId = $('[name=userId]').val();
      this.$data.userIds.push(userId)
      addListenUser(userId);
      window.localStorage && window.localStorage.setItem('listenUserIds', this.$data.userIds.join(','));
      $('[name=userId]').val('');
    },
    removeListenUser: function (event) {
      var target = $(event.currentTarget);
      var userIds = this.$data.userIds;
      var userId = target.data('userid');

      userIds.$remove(userId);

      window.localStorage && window.localStorage.setItem('listenUserIds', this.$data.userIds.join(','));

      removeListenUser(userId);
    }
  }
})

_.each(userIds, function(userId) {
  addListenUser(userId);
})
