// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var AppConf,
    __hasProp = {}.hasOwnProperty;

  AppConf = (function() {

    function AppConf(Epic, loadStrategy) {
      var _base, _base1, _base2, _ref, _ref1, _ref2;
      this.Epic = Epic;
      this.loadStrategy = loadStrategy;
      this.config = this.loadStrategy.getCombinedAppConfs();
      if ((_ref = (_base = this.config).CLICKS) == null) {
        _base.CLICKS = {};
      }
      if ((_ref1 = (_base1 = this.config).MACROS) == null) {
        _base1.MACROS = {};
      }
      if ((_ref2 = (_base2 = this.config.OPTIONS).frame) == null) {
        _base2.frame = {};
      }
      this.config.FORMS = false;
    }

    AppConf.prototype.getObj = function(view_name, attribute) {
      if (!(view_name in this.config.MODELS)) {
        throw new Error("No (" + view_name + ") in 'MODELS:' in app.js");
      }
      if (!(attribute in this.config.MODELS[view_name])) {
        throw new Error("No (" + atrribute + ") in 'MODELS:" + view_name + "' in app.js");
      }
      return this.config.MODELS[view_name][attribute];
    };

    AppConf.prototype.loadFormsIf = function() {
      var form_nm, group, node, view_nm, _base, _i, _len, _ref, _ref1, _ref2;
      if (this.config.FORMS === false) {
        this.config.FORMS = {};
        _ref = this.config.MODELS;
        for (view_nm in _ref) {
          if (!__hasProp.call(_ref, view_nm)) continue;
          node = _ref[view_nm];
          if (!('forms' in node)) {
            continue;
          }
          group = node.group;
          if (group == null) {
            group = this.config.OPTIONS.settings.group;
          }
          if ((_ref1 = (_base = this.config.FORMS)[group]) == null) {
            _base[group] = {};
          }
          _ref2 = node.forms.split(',');
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            form_nm = _ref2[_i];
            this.config.FORMS[group][form_nm] = view_nm;
          }
        }
      }
      return this.config.FORMS;
    };

    AppConf.prototype.getFistView = function(group_nm, fist_nm) {
      this.loadFormsIf();
      return this.config.FORMS[group_nm][fist_nm];
    };

    AppConf.prototype.findNode = function(f, t, s, cat, nm) {
      var ncat, nf, ns, nt, _ref, _ref1, _ref2, _ref3, _ref4;
      nf = this.config.FLOWS[f];
      if (nf) {
        if (t && ((nt = (_ref = nf.TRACKS) != null ? _ref[t] : void 0) != null)) {
          if (s && ((ns = (_ref1 = nt.STEPS) != null ? _ref1[s] : void 0) != null)) {
            if ((ncat = (_ref2 = ns[cat]) != null ? _ref2[nm] : void 0) != null) {
              return ncat;
            }
          }
          if ((ncat = (_ref3 = nt[cat]) != null ? _ref3[nm] : void 0) != null) {
            return ncat;
          }
        }
        if ((ncat = (_ref4 = nf[cat]) != null ? _ref4[nm] : void 0) != null) {
          return ncat;
        }
      }
      return false;
    };

    AppConf.prototype.findAttr = function(f, t, s, attr) {
      var nattr, nf, ns, nt, _ref, _ref1;
      nf = this.config.FLOWS[f];
      if (nf) {
        if (t && ((nt = (_ref = nf.TRACKS) != null ? _ref[t] : void 0) != null)) {
          if (s && ((ns = (_ref1 = nt.STEPS) != null ? _ref1[s] : void 0) != null)) {
            if ((nattr = ns[attr]) != null) {
              return nattr;
            }
          }
          if ((nattr = nt[attr]) != null) {
            return nattr;
          }
        }
        if ((nattr = nf[attr]) != null) {
          return nattr;
        }
      }
      return false;
    };

    AppConf.prototype.getF = function(f) {
      return this.config.FLOWS[f];
    };

    AppConf.prototype.getT = function(f, t) {
      return this.config.FLOWS[f].TRACKS[t];
    };

    AppConf.prototype.getS = function(f, t, s) {
      return this.config.FLOWS[f].TRACKS[t].STEPS[s];
    };

    AppConf.prototype.startT = function(f) {
      return this.getF(f).start;
    };

    AppConf.prototype.startS = function(f, t) {
      return this.getT(f, t).start;
    };

    AppConf.prototype.getPage = function(p) {
      return this.getS(p[0], p[1], p[2]).page;
    };

    AppConf.prototype.getMacro = function(nm) {
      return this.config.MACROS[nm];
    };

    AppConf.prototype.getMacroNode = function(nm) {
      var node;
      node = this.getMacro(nm);
      if (node) {
        return new window.EpicMvc.ConfExe(node);
      }
      return false;
    };

    AppConf.prototype.loginF = function() {
      return this.config.OPTIONS.login.flow;
    };

    AppConf.prototype.findClick = function(p, a) {
      var n, node;
      node = this.findNode(p[0], p[1], p[2], 'CLICKS', a);
      if (node === false && ((n = this.config.CLICKS[a]) != null)) {
        node = n;
      }
      if (node) {
        return new window.EpicMvc.ConfExe(node);
      }
      return null;
    };

    AppConf.prototype.mapModalTemplate = function(modal) {
      return this.config.OPTIONS.template[modal] || modal;
    };

    AppConf.prototype.findTemplate = function(f, t, s) {
      var template;
      if (typeof t === 'undefined') {
        s = f[2];
        t = f[1];
        f = f[0];
      }
      return template = (this.findAttr(f, t, s, 'template')) || this.config.OPTIONS.template["default"];
    };

    AppConf.prototype.getShowIssues = function(f, t) {
      var group;
      return group = (this.findAttr(f, t, false, 'show_issues')) || this.config.OPTIONS.settings.show_issues;
    };

    AppConf.prototype.getGroupNm = function(f, t) {
      var group;
      return group = (this.findAttr(f, t, false, 'group')) || this.config.OPTIONS.settings.group;
    };

    AppConf.prototype.getVars = function(f, t, s) {
      var f2, k, v, vars;
      f2 = ':AppConf.getVars';
      vars = $.extend({}, this.config.FLOWS[f].v, this.config.FLOWS[f].TRACKS[t].v, this.config.FLOWS[f].TRACKS[t].STEPS[s].v);
      this.Epic.log2(f2, ((function() {
        var _results;
        _results = [];
        for (k in vars) {
          if (!__hasProp.call(vars, k)) continue;
          v = vars[k];
          _results.push("" + k + ":" + v);
        }
        return _results;
      })()).join(', '));
      return vars;
    };

    AppConf.prototype.getFrames = function() {
      return this.config.OPTIONS.frame;
    };

    return AppConf;

  })();

  window.EpicMvc.AppConf = AppConf;

}).call(this);
