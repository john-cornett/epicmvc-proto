// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var LoadStrategy;

  LoadStrategy = (function() {

    function LoadStrategy(appconfs) {
      var dir, dir_map, i, pkg, pkgs, _i, _j, _len, _len1, _ref, _ref1;
      this.appconfs = appconfs;
      this.clearCache();
      this.cache_local_flag = true;
      this.reverse_packages = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = _ref = this.appconfs.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
          _results.push(this.appconfs[i]);
        }
        return _results;
      }).call(this);
      dir_map = {};
      _ref = E.option.load_dirs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], dir = _ref1.dir, pkgs = _ref1.pkgs;
        for (_j = 0, _len1 = pkgs.length; _j < _len1; _j++) {
          pkg = pkgs[_j];
          dir_map[pkg] = dir;
        }
      }
      this.dir_map = dir_map;
    }

    LoadStrategy.prototype.clearCache = function() {
      this.cache = {};
      return this.refresh_stamp = (new Date).valueOf();
    };

    LoadStrategy.prototype.D_loadAsync = function() {
      var def, f, file, file_list, head, pkg, promise, script_attrs, type, url, _fn, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3,
        _this = this;
      f = 'Base:E/LoadStragegy.loadAsync';
      head = document.getElementsByTagName('head')[0];
      script_attrs = {
        type: 'text/javascript'
      };
      def = new m.Deferred();
      promise = def.promise;
      _ref = this.appconfs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pkg = _ref[_i];
        if (!(pkg in this.dir_map)) {
          continue;
        }
        _ref3 = (_ref1 = (_ref2 = E['app$' + pkg]) != null ? _ref2.MANIFEST : void 0) != null ? _ref1 : {};
        for (type in _ref3) {
          file_list = _ref3[type];
          _fn = function(file, type, pkg, url) {
            return promise = promise.then(function() {
              return (m.request({
                background: true,
                method: 'GET',
                url: url,
                data: {
                  _: _this.refresh_stamp
                },
                config: function(xhr, options) {
                  xhr.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
                  return xhr;
                },
                deserialize: function(x) {
                  return x;
                }
              })).then(function(data) {
                _log2(f, 'Got a script', url, data.slice(0, 10));
                return (Function(data))();
              }).then(null, function(error) {
                _log2('AJAX ERROR LOADING SCRIPT', url, error);
                return false;
              });
            });
          };
          for (_j = 0, _len1 = file_list.length; _j < _len1; _j++) {
            file = file_list[_j];
            url = this.dir_map[pkg] + pkg + '/' + type + '/' + file + '.js';
            _fn(file, type, pkg, url);
          }
        }
      }
      def.resolve(null);
      return promise;
    };

    LoadStrategy.prototype.inline = function(type, nm) {
      var el, f, id;
      f = 'inline';
      el = document.getElementById(id = 'view-' + type + '-' + nm);
      _log2(f, 'inline el=', id, el);
      if (el) {
        return el.innerHTML;
      }
      return null;
    };

    LoadStrategy.prototype.preLoaded = function(pkg, type, nm) {
      var f, r, _ref, _ref1;
      f = 'preLoaded';
      _log2(f, 'looking for ', pkg, type, nm);
      r = (_ref = E['view$' + pkg]) != null ? (_ref1 = _ref[type]) != null ? _ref1[nm] : void 0 : void 0;
      _log2(f, 'found', ((r != null ? r.preloaded : void 0) ? 'PRELOADED' : 'broken'), r);
      return r;
    };

    LoadStrategy.prototype.compile = function(name, uncompiled) {
      var parsed;
      parsed = E.Extra.ParseFile(name, uncompiled);
      parsed.content = new Function(parsed.content);
      if (this.cache_local_flag) {
        this.cache[name] = parsed;
      }
      return parsed;
    };

    LoadStrategy.prototype.d_get = function(type, nm) {
      var def, f, full_nm, pkg, promise, uncompiled, _fn, _i, _len, _ref,
        _this = this;
      f = 'd_get';
      full_nm = type + '/' + nm + '.html';
      if (this.cache[full_nm] != null) {
        return this.cache[full_nm];
      }
      if (uncompiled = this.inline(type, nm)) {
        return this.compile(full_nm, uncompiled);
      }
      def = new m.Deferred();
      def.resolve(false);
      promise = def.promise;
      _ref = this.reverse_packages;
      _fn = function(pkg) {
        return promise = promise.then(function(result) {
          var compiled;
          _log2(f, 'THEN-' + pkg, full_nm, 'S' === E.type_oau(result) ? result.slice(0, 40) : result);
          if (result !== false) {
            return result;
          }
          if (compiled = _this.preLoaded(pkg, type, nm)) {
            return compiled;
          }
          if (!(pkg in _this.dir_map)) {
            return false;
          }
          return _this.D_getFile(pkg, full_nm);
        });
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pkg = _ref[_i];
        _fn(pkg);
      }
      promise = promise.then(function(result) {
        var parsed;
        if (result !== false) {
          if (result != null ? result.preloaded : void 0) {
            return result;
          }
          parsed = _this.compile(full_nm, result);
        } else {
          _log2('ERROR', 'NO FILE FOUND! ' + type + ' - ' + nm);
          parsed = false;
        }
        return parsed;
      });
      promise.then(null, function(error) {
        throw error;
      });
      return promise;
    };

    LoadStrategy.prototype.D_getFile = function(pkg, nm) {
      var path;
      path = this.dir_map[pkg] + pkg + '/';
      return (m.request({
        background: true,
        method: 'GET',
        url: path + nm,
        data: {
          _: (new Date).valueOf()
        },
        config: function(xhr, options) {
          xhr.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
          return xhr;
        },
        deserialize: function(x) {
          return x;
        }
      })).then(null, function(error) {
        return false;
      });
    };

    LoadStrategy.prototype.d_layout = function(nm) {
      return this.d_get('Layout', nm);
    };

    LoadStrategy.prototype.d_page = function(nm) {
      return this.d_get('Page', nm);
    };

    LoadStrategy.prototype.d_part = function(nm) {
      return this.d_get('Part', nm);
    };

    LoadStrategy.prototype.fist = function(grp_nm) {
      return BROKEN();
    };

    return LoadStrategy;

  })();

  E.Extra.LoadStrategy$BaseDevl = LoadStrategy;

}).call(this);