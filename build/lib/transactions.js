// Generated by IcedCoffeeScript 108.0.9
(function() {
  var addresses, curve, e, elliptic, hash, iced, transaction, txn_opt, txns, _, __iced_deferrals, __iced_k, __iced_k_noop,
    __slice = [].slice;

  iced = {
    Deferrals: (function() {
      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) {
          return this.continuation(this.ret);
        }
      };

      _Class.prototype.defer = function(defer_params) {
        ++this.count;
        return (function(_this) {
          return function() {
            var inner_params, _ref;
            inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (defer_params != null) {
              if ((_ref = defer_params.assign_fn) != null) {
                _ref.apply(null, inner_params);
              }
            }
            return _this._fulfill();
          };
        })(this);
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  if (!module.parent) {
    global.CONFIG = (require('dotenv').config({
      path: __dirname + '/../../config'
    })).parsed;
  }

  _ = require('wegweg')({
    globals: true
  });

  elliptic = require('elliptic');

  curve = new elliptic.ec('curve25519');

  addresses = require('./addresses');

  hash = require('./hash');

  module.exports = txns = {
    pool: []
  };

  txns.get_id = (function(transaction, cb) {
    var bulk, item, _i, _len, _ref;
    bulk = transaction.from;
    bulk += transaction.last_output_block;
    _ref = transaction.outputs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      bulk += item.to;
      bulk += item.amount;
    }
    return cb(null, hash.sha256(bulk));
  });

  txns.get_signature = (function(transaction, priv, cb) {
    var signed;
    signed = addresses.sign(transaction.id, priv);
    return cb(null, signed);
  });

  txns.verify_signature = (function(transaction, cb) {
    var valid;
    valid = addresses.verify(transaction.id, transaction.signature, transaction.from);
    return cb(null, valid);
  });

  txns.create = (function(opt, cb) {
    var balance, blockchain, e, item, required, transaction, x, ___iced_passed_deferral, __iced_deferrals, __iced_k, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    required = ['from', 'priv', 'outputs'];
    for (_i = 0, _len = required.length; _i < _len; _i++) {
      x = required[_i];
      if (!opt[x]) {
        return cb(new Error("`" + x + "` required"));
      }
    }
    if (!((_ref = opt.outputs) != null ? _ref.length : void 0)) {
      return cb(new Error('Transaction has no outputs'));
    }
    _ref1 = opt.outputs;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      _ref2 = ['to', 'amount'];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        x = _ref2[_k];
        if (!item[x]) {
          return cb(new Error("`output." + x + "` required"));
        }
      }
    }
    transaction = {
      id: null,
      from: opt.from,
      last_output_block: null,
      signature: null,
      outputs: opt.outputs
    };
    blockchain = require(__dirname + '/blockchain');
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/douglaslauer/www/blockchain/src/lib/transactions.iced"
        });
        blockchain.get_balance(opt.from, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              e = arguments[0];
              return balance = arguments[1];
            };
          })(),
          lineno: 72
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        var _ref3;
        if (e) {
          return cb;
        }
        transaction.last_output_block = (_ref3 = typeof balance !== "undefined" && balance !== null ? balance.last_output_block : void 0) != null ? _ref3 : null;
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/douglaslauer/www/blockchain/src/lib/transactions.iced"
          });
          _this.get_id(transaction, __iced_deferrals.defer({
            assign_fn: (function(__slot_1) {
              return function() {
                e = arguments[0];
                return __slot_1.id = arguments[1];
              };
            })(transaction),
            lineno: 78
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (e) {
            return cb(e);
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/douglaslauer/www/blockchain/src/lib/transactions.iced"
            });
            _this.get_signature(transaction, opt.priv, __iced_deferrals.defer({
              assign_fn: (function(__slot_1) {
                return function() {
                  e = arguments[0];
                  return __slot_1.signature = arguments[1];
                };
              })(transaction),
              lineno: 82
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (e) {
              return cb(e);
            }
            return cb(null, transaction);
          });
        });
      };
    })(this));
  });

  txns.validate = (function(transaction, cb) {
    var balance, blockchain, calculated_tid, e, item, required, total_out, valid, x, ___iced_passed_deferral, __iced_deferrals, __iced_k, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    required = ['id', 'from', 'signature', 'outputs'];
    for (_i = 0, _len = required.length; _i < _len; _i++) {
      x = required[_i];
      if (!transaction[x]) {
        return cb(new Error("Invalid transaction (`" + x + "` required)"));
      }
    }
    if (transaction.last_output_block == null) {
      transaction.last_output_block = null;
    }
    if (!((_ref = transaction.outputs) != null ? _ref.length : void 0)) {
      return cb(new Error('Invalid transaction (no outputs)'));
    }
    if (_.type(transaction.outputs) !== 'array') {
      transaction.outputs = [transaction.outputs];
    }
    total_out = 0;
    _ref1 = transaction.outputs;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      _ref2 = ['to', 'amount'];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        x = _ref2[_k];
        if (!item[x]) {
          return cb(new Error("`output." + x + "` required"));
        }
      }
      total_out += +item.amount;
    }
    blockchain = require(__dirname + '/blockchain');
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/douglaslauer/www/blockchain/src/lib/transactions.iced"
        });
        blockchain.get_balance(transaction.from, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              e = arguments[0];
              return balance = arguments[1];
            };
          })(),
          lineno: 119
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (e) {
          return cb(e);
        }
        if (!balance || ((typeof balance !== "undefined" && balance !== null ? balance.amount : void 0) < total_out)) {
          return cb(new Error('Invalid transaction (output total exceeds balance)'));
        }
        if ((typeof balance !== "undefined" && balance !== null ? balance.last_output_block : void 0) !== transaction.last_output_block) {
          return cb(new Error('Invalid transaction (`last_output_block`)'));
        }
        (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/douglaslauer/www/blockchain/src/lib/transactions.iced"
          });
          _this.get_id(transaction, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                e = arguments[0];
                return calculated_tid = arguments[1];
              };
            })(),
            lineno: 130
          }));
          __iced_deferrals._fulfill();
        })(function() {
          if (e) {
            return cb(e);
          }
          if (transaction.id !== calculated_tid) {
            return cb(new Error('Invalid transaction (`id`)'));
          }
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/douglaslauer/www/blockchain/src/lib/transactions.iced"
            });
            _this.verify_signature(transaction, __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  e = arguments[0];
                  return valid = arguments[1];
                };
              })(),
              lineno: 137
            }));
            __iced_deferrals._fulfill();
          })(function() {
            if (e) {
              return cb(e);
            }
            if (!valid) {
              return cb(new Error('Invalid transaction (`signature`)'));
            }
            return cb(null, true);
          });
        });
      };
    })(this));
  });

  if (!module.parent) {
    log(/TEST/);
    txn_opt = {
      from: addresses.TEST_ADDRESSES.DAN.pub,
      priv: addresses.TEST_ADDRESSES.DAN.priv,
      outputs: [
        {
          to: addresses.TEST_ADDRESSES.BOB.pub,
          amount: 5
        }
      ]
    };
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          filename: "/Users/douglaslauer/www/blockchain/src/lib/transactions.iced"
        });
        txns.create(txn_opt, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              e = arguments[0];
              return transaction = arguments[1];
            };
          })(),
          lineno: 161
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (e) {
          throw e;
        }
        log(/transaction/);
        log(transaction);
        return __iced_k(exit(0));
      };
    })(this));
  } else {
    __iced_k();
  }

}).call(this);