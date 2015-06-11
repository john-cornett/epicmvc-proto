// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var LoadStrategy;

  LoadStrategy = (function() {

    function LoadStrategy(appconfs) {
      var i;
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
    }

    LoadStrategy.prototype.clearCache = function() {
      this.cache = {};
      return this.refresh_stamp = (new Date).valueOf();
    };

    LoadStrategy.prototype.makePkgDir = function(pkg) {
      return E.option.loadDirs[pkg] + ((E.option.loadDirs[pkg].slice(-1)) === '/' ? pkg : '');
    };

    LoadStrategy.prototype.D_loadAsync = function() {
      var def, el, f, file, file_list, next, pkg, promise, sub, type, url, work, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      f = 'Dev:E/LoadStrategy.loadAsync';
      _ref = this.appconfs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pkg = _ref[_i];
        if (!(pkg in E.option.loadDirs)) {
          continue;
        }
        _ref2 = (_ref1 = E['manifest$' + pkg]) != null ? _ref1 : {};
        for (type in _ref2) {
          file_list = _ref2[type];
          if (type === 'css') {
            for (_j = 0, _len1 = file_list.length; _j < _len1; _j++) {
              file = file_list[_j];
              url = (this.makePkgDir(pkg)) + '/css/' + file + '.css';
              el = document.createElement('link');
              el.setAttribute('rel', 'stylesheet');
              el.setAttribute('type', 'text/css');
              el.setAttribute('href', url);
              document.head.appendChild(el);
            }
          }
        }
      }
      work = [];
      def = new m.Deferred();
      promise = def.promise;
      _ref3 = this.appconfs;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        pkg = _ref3[_k];
        if (!(pkg in E.option.loadDirs)) {
          continue;
        }
        _ref5 = (_ref4 = E['manifest$' + pkg]) != null ? _ref4 : {};
        for (type in _ref5) {
          file_list = _ref5[type];
          if (type !== 'css') {
            for (_l = 0, _len3 = file_list.length; _l < _len3; _l++) {
              file = file_list[_l];
              sub = type === 'root' ? '' : type + '/';
              url = (this.makePkgDir(pkg)) + '/' + sub + file + '.js';
              work.push(url);
            }
          }
        }
      }
      next = function(ix) {
        if (ix >= work.length) {
          _log2(f, ix, 'done.');
          def.resolve(null);
          return;
        }
        _log2(f, 'doing', ix, work[ix]);
        el = document.createElement('script');
        el.setAttribute('type', 'text/javascript');
        el.setAttribute('src', work[ix]);
        el.onload = function() {
          return next(ix + 1);
        };
        document.head.appendChild(el);
      };
      next(0);
      return promise;
    };

    LoadStrategy.prototype.inline = function(type, nm) {
      var el, f, id;
      f = 'inline';
      el = document.getElementById(id = 'view-' + type + '-' + nm);
      if (el) {
        return el.innerHTML;
      }
      return null;
    };

    LoadStrategy.prototype.preLoaded = function(pkg, type, nm) {
      var f, r, _ref, _ref1;
      f = 'preLoaded';
      r = (_ref = E['view$' + pkg]) != null ? (_ref1 = _ref[type]) != null ? _ref1[nm] : void 0 : void 0;
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
      var def, f, full_nm, full_nm_alt, pkg, promise, type_alt, uncompiled, _fn, _i, _j, _len, _len1, _ref, _ref1,
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
      type_alt = type === 'Layout' ? 'tmpl' : type.toLowerCase();
      full_nm_alt = type + '/' + nm + '.' + type_alt + '.html';
      if (E.option.compat_path) {
        _ref = this.reverse_packages;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pkg = _ref[_i];
          if ((pkg !== 'Base' && pkg !== 'Dev' && pkg !== 'Proto') && type !== 'Layout') {
            (function(pkg) {
              return promise = promise.then(function(result) {
                if (result !== false) {
                  return result;
                }
                if (!(pkg in E.option.loadDirs)) {
                  return false;
                }
                return _this.D_getFile(pkg, full_nm_alt);
              });
            })(pkg);
          }
        }
      }
      _ref1 = this.reverse_packages;
      _fn = function(pkg) {
        return promise = promise.then(function(result) {
          var compiled;
          if (result !== false) {
            return result;
          }
          if (compiled = _this.preLoaded(pkg, type, nm)) {
            return compiled;
          }
          if (!(pkg in E.option.loadDirs)) {
            return false;
          }
          return _this.D_getFile(pkg, full_nm);
        });
      };
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        pkg = _ref1[_j];
        _fn(pkg);
      }
      promise = promise.then(function(result) {
        var parsed;
        if (result !== false) {
          parsed = (result != null ? result.preloaded : void 0) ? result : _this.compile(full_nm, result);
        } else {
          throw new Error("Unable to locate View file (" + full_nm + ").");
          console.error('ERROR', 'NO FILE FOUND! ', full_nm);
          parsed = false;
        }
        _this.cache[full_nm] = parsed;
        return parsed;
      });
      promise.then(null, function(error) {
        throw error;
      });
      this.cache[full_nm] = promise;
      return promise;
    };

    LoadStrategy.prototype.D_getFile = function(pkg, nm) {
      var path;
      path = (this.makePkgDir(pkg)) + '/';
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

    return LoadStrategy;

  })();

  E.Extra.LoadStrategy$Dev = LoadStrategy;

  E.opt({
    loader: 'LoadStrategy$Dev'
  });

}).call(this);
