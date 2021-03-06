// Generated by IcedCoffeeScript 108.0.12
(function() {
  var ascii, http_server, k, peers, v, _, _ref;

  global.PROCESS_STARTED = new Date;

  global.CONFIG = (require('dotenv').config({
    path: __dirname + '/../config'
  })).parsed;

  _ref = process.env;
  for (k in _ref) {
    v = _ref[k];
    if (global.CONFIG[k]) {
      global.CONFIG[k] = v;
    }
  }

  _ = require('wegweg')({
    globals: true
  });

  if (_.exists(ascii = __dirname + '/../ascii.art')) {
    log(_.reads(ascii));
  }

  log(CONFIG);

  peers = require('./lib/peers');

  peers.server.listen(env.WEBSOCKET_PORT);

  http_server = require('./lib/rest');

  http_server.listen(CONFIG.HTTP_PORT);

}).call(this);
