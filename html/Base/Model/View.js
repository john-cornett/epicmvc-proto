// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var View$Base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  View$Base = (function(_super) {

    __extends(View$Base, _super);

    function View$Base(view_nm, options) {
      this.ex = __bind(this.ex, this);

      this.T_if = __bind(this.T_if, this);

      this.T_page = __bind(this.T_page, this);

      this.handleIt = __bind(this.handleIt, this);

      this.doDefer = __bind(this.doDefer, this);

      var frames, ix, nm;
      View$Base.__super__.constructor.call(this, view_nm, options);
      frames = E.appGetSetting('frames');
      this.frames = (function() {
        var _i, _len, _ref, _results;
        _ref = ((function() {
          var _results1;
          _results1 = [];
          for (nm in frames) {
            _results1.push(nm);
          }
          return _results1;
        })()).sort();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ix = _ref[_i];
          _results.push(frames[ix]);
        }
        return _results;
      })();
      this.frames.push('X');
      this.did_run = false;
      this.in_run = false;
      window.oE = this;
      this.defer_it_cnt = 0;
      this.start = false;
    }

    View$Base.prototype.nest_up = function(who) {
      var f;
      f = 'nest_up:' + who;
      if (this.defer_it_cnt === 0) {
        if (this.in_run) {
          BLOWUP();
        }
        this.in_run = true;
        this.start = new Date().getTime();
        this.defer_it = new m.Deferred();
      }
      return this.defer_it_cnt++;
    };

    View$Base.prototype.nest_dn = function(who) {
      var f;
      f = 'nest_dn:' + who;
      if (this.defer_it_cnt > 0) {
        this.defer_it_cnt--;
      }
      if (this.defer_it_cnt === 0) {
        _log2(f, 'END RUN', this.defer_content, new Date().getTime() - this.start);
        this.in_run = false;
        return this.defer_it.resolve([this.modal, this.defer_content]);
      }
    };

    View$Base.prototype.run = function() {
      var f, flow, layout, modal, step, track, who, _ref, _ref1, _ref2;
      f = 'run';
      who = 'R';
      _ref = E.App().getStepPath(), flow = _ref[0], track = _ref[1], step = _ref[2];
      if (modal = E.appFindAttr(flow, track, step, 'modal')) {
        modal = (_ref1 = (E.appGetSetting('modals'))[modal]) != null ? _ref1 : modal;
      }
      layout = modal != null ? modal : E.appGetSetting('layout', flow, track, step);
      this.modal = modal ? true : false;
      this.page_name = (_ref2 = (E.appGetS(flow, track, step)).page) != null ? _ref2 : step;
      this.did_run = true;
      this.frames[this.frames.length - 1] = layout;
      this.frame_inx = 0;
      this.resetInfo();
      this.nest_up(who);
      this.defer_content = this.kids([['page', {}]]);
      this.nest_dn(who);
      return this.defer_it.promise;
    };

    View$Base.prototype.resetInfo = function() {
      this.R = {};
      this.I = {};
      this.P = [{}];
      this.N = {};
      return this.D = [[]];
    };

    View$Base.prototype.saveInfo = function() {
      var f, saved_info;
      f = 'saveInfo';
      saved_info = E.merge({}, {
        I: this.I,
        P: this.P
      });
      return saved_info;
    };

    View$Base.prototype.restoreInfo = function(saved_info) {
      var f, nm, _results;
      f = 'restoreInfo';
      this.resetInfo();
      this.P = saved_info.P;
      this.I = saved_info.I;
      _results = [];
      for (nm in this.I) {
        if (!(nm in this.R)) {
          _results.push(this.R[nm] = this._getMyRow(this.I[nm]));
        }
      }
      return _results;
    };

    View$Base.prototype._getMyRow = function(I) {
      var f;
      f = '_getMyRow';
      if (I.m != null) {
        return (E[I.m](I.o))[I.c];
      }
      if (!(I.p in this.R)) {
        this.R[I.p] = this._getMyRow(this.I[I.p]);
      }
      if (I.p && I.p in this.R) {
        return this.R[I.p][I.o][I.c];
      }
    };

    View$Base.prototype.getTable = function(nm) {
      var f;
      f = 'Base:M/View.getTable:' + nm;
      switch (nm) {
        case 'If':
          return [this.N];
        case 'Part':
          return this.P.slice(-1);
        default:
          return [];
      }
    };

    View$Base.prototype.invalidateTables = function(view_nm, tbl_nms, deleted_tbl_nms) {
      var f;
      if (!(this.did_run && deleted_tbl_nms.length)) {
        return;
      }
      f = 'Base:M/View.invalidateTables';
      m.startComputation();
      m.endComputation();
    };

    View$Base.prototype.wrap = function(view, attrs, content, defer, has_root) {
      var f, inside,
        _this = this;
      f = 'wrap';
      if (defer.length) {
        inside = E.merge([], defer);
        attrs.config = function(element, isInit, context) {
          var _i, _len, _results;
          f = 'Base:M/View..config:' + view;
          _results = [];
          for (_i = 0, _len = inside.length; _i < _len; _i++) {
            defer = inside[_i];
            _log2(f, defer);
            _results.push(_this.doDefer(defer, element, isInit, context));
          }
          return _results;
        };
      }
      if ('dynamic' in attrs) {
        return {
          tag: attrs.dynamic,
          attrs: attrs,
          children: content
        };
      } else {
        if (!content) {
          return '';
        }
        if (has_root) {
          _log2(f, 'has-root-content', {
            view: view,
            attrs: attrs,
            content: content,
            defer: defer,
            has_root: has_root
          });
          if ('A' !== E.type_oau(content)) {
            BLOWUP();
          }
          return content;
        } else {
          return {
            tag: 'div',
            attrs: attrs,
            children: content
          };
        }
      }
    };

    View$Base.prototype.doDefer = function(defer_obj, element, isInit, context) {
      if ('A' === E.type_oau(defer_obj.defer)) {
        _log2('WARNING', 'Got an array for defer', defer_obj.defer);
        return 'WAS-ARRAY';
      }
      if (defer_obj.func) {
        return defer_obj.func(element, isInit, context, defer_obj.attrs);
      }
    };

    View$Base.prototype.handleIt = function(content) {
      var f;
      f = 'handleIt';
      if (typeof content === 'function') {
        content = content();
      }
      return content;
    };

    View$Base.prototype.formatFromSpec = function(val, spec, custom_spec) {
      var f, left, right, str, _base, _ref;
      f = 'formatFromSpec';
      switch (spec) {
        case '':
          if (custom_spec) {
            return typeof (_base = window.EpicMvc).custom_filter === "function" ? _base.custom_filter(val, custom_spec) : void 0;
          } else {
            return val;
          }
        case 'count':
          return val != null ? val.length : void 0;
        case 'bool':
          if (val) {
            return true;
          } else {
            return false;
          }
        case 'bytes':
          return window.bytesToSize(Number(val));
        case 'uriencode':
          return encodeURIComponent(val);
        case 'quo':
          return ((val.replace(/\\/g, '\\\\')).replace(/'/g, '\\\'')).replace(/"/g, '\\"');
        case '1':
          return (String(val))[0];
        case 'lc':
          return (String(val)).toLowerCase();
        case 'ucFirst':
          str = (String(str)).toLowerCase();
          return str.slice(0, 1).toUpperCase() + str.slice(1);
        default:
          if (spec[0] === '?') {
            _ref = spec.slice(1).split('?'), left = _ref[0], right = _ref[1];
            return (val ? left : right != null ? right : '').replace(new RegExp('[%]', 'g'), val);
          } else {
            return E.option.v1(val, spec);
          }
      }
    };

    View$Base.prototype.v3 = function(view_nm, tbl_nm, key, format_spec, custom_spec) {
      var row, val;
      row = (E[view_nm](tbl_nm))[0];
      val = row[key];
      if (format_spec != null) {
        return this.formatFromSpec(val, format_spec, custom_spec);
      } else {
        return val;
      }
    };

    View$Base.prototype.v2 = function(table_ref, col_nm, format_spec, custom_spec) {
      var ans;
      if (col_nm[0] === '_') {
        ans = this.R[table_ref]._[(col_nm.slice(1)).toLowerCase()];
      } else {
        ans = this.R[table_ref][col_nm];
      }
      if (format_spec != null) {
        return this.formatFromSpec(ans, format_spec, custom_spec);
      } else {
        return ans;
      }
    };

    View$Base.prototype.weed = function(attrs) {
      var clean_attrs, f, nm, val;
      f = 'weed';
      clean_attrs = {};
      for (nm in attrs) {
        val = attrs[nm];
        if (nm[0] !== '?') {
          clean_attrs[nm] = val;
        } else {
          if (val) {
            clean_attrs[nm.slice(1)] = val;
          }
        }
      }
      return clean_attrs;
    };

    View$Base.prototype.kids = function(kids) {
      var ans, f, ix, kid, out, who, _i, _len,
        _this = this;
      f = 'kids';
      who = 'K';
      out = [];
      for (ix = _i = 0, _len = kids.length; _i < _len; ix = ++_i) {
        kid = kids[ix];
        if ('A' === E.type_oau(kid)) {
          out.push(ix);
          ans = this['T_' + kid[0]](kid[1], kid[2]);
          if (ans != null ? ans.then : void 0) {
            this.nest_up(who);
            (function(ix) {
              return ans.then(function(result) {
                out[ix] = result;
                return _this.nest_dn(who);
              }, function(err) {
                console.error('kids', err);
                out[ix] = err.message;
                return _this.nest_dn(who);
              });
            })(ix);
          } else {
            out[ix] = ans;
          }
        } else {
          out.push(kid);
        }
      }
      return out;
    };

    View$Base.prototype.loadPartAttrs = function(attrs) {
      var attr, f, result, val;
      f = 'Base:M/View.loadPartAttrs';
      result = {};
      for (attr in attrs) {
        val = attrs[attr];
        if ('data-e-' !== attr.slice(0, 7)) {
          continue;
        }
        result[attr.slice(7)] = val;
      }
      return result;
    };

    View$Base.prototype.T_page = function(attrs) {
      var d_load, f, name, view;
      f = 'T_page';
      if (this.frame_inx < this.frames.length) {
        d_load = E.oLoader.d_layout(name = this.frames[this.frame_inx++]);
        view = (this.frame_inx < this.frames.length ? 'Frame' : 'Layout') + '/' + name;
      } else {
        d_load = E.oLoader.d_page(name = this.page_name);
        view = 'Page/' + name;
      }
      return this.piece_handle(view, attrs != null ? attrs : {}, d_load);
    };

    View$Base.prototype.T_part = function(attrs) {
      var d_load, f, view;
      view = attrs.part;
      f = 'T_part:' + view;
      d_load = E.oLoader.d_part(view);
      return this.piece_handle('Part/' + view, attrs, d_load, true);
    };

    View$Base.prototype.piece_handle = function(view, attrs, obj, is_part) {
      var can_componentize, content, defer, f, result;
      f = 'piece_handle';
      if (obj != null ? obj.then : void 0) {
        return this.D_piece(view, attrs, obj, is_part);
      }
      content = obj.content, can_componentize = obj.can_componentize;
      this.P.push(this.loadPartAttrs(attrs));
      this.D.push([]);
      content = this.handleIt(content);
      defer = this.D.pop();
      if (can_componentize || attrs.dynamic || defer.length || !is_part) {
        if (defer.length && !can_componentize && !attrs.dynamic) {
          _log2("WARNING: DEFER logic in (" + view + "); wrapping DIV tag.");
        }
        result = this.wrap(view, attrs, content, defer, can_componentize);
      } else {
        _log2(f, 'defer NO!', view, defer);
        result = content;
      }
      return result;
    };

    View$Base.prototype.D_piece = function(view, attrs, d_load, is_part) {
      var d_result, f, saved_info, who,
        _this = this;
      f = 'D_piece';
      who = 'P';
      this.nest_up(who + view);
      saved_info = this.saveInfo();
      d_result = d_load.then(function(obj) {
        var result;
        try {
          if (obj != null ? obj.then : void 0) {
            BLOWUP();
          }
          _this.restoreInfo(saved_info);
          result = _this.piece_handle(view, attrs, obj, is_part);
          return result;
        } finally {
          _this.nest_dn(who + view);
        }
      }, function(err) {
        console.error('D_piece', err);
        _this.nest_dn(who + view + ' IN-ERROR');
        return _this._Err('tag', 'page/part', attrs, err);
        throw err;
      });
      return d_result;
    };

    View$Base.prototype.T_defer = function(attrs, content) {
      var ans, f, f_content, joiner, sep;
      f = 'Base:M/View.T_defer:';
      f_content = this.handleIt(content);
      if ('A' === E.type_oau(f_content)) {
        sep = '';
        ans = '';
        joiner = function(a) {
          var e, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = a.length; _i < _len; _i++) {
            e = a[_i];
            if ('A' === E.type_oau(e)) {
              _results.push(joiner(e));
            } else {
              _results.push(ans += sep + e);
            }
          }
          return _results;
        };
        joiner(f_content);
        f_content = ans;
      }
      this.D[this.D.length - 1].push({
        attrs: attrs,
        func: new Function('element', 'isInit', 'context', 'attrs', f_content)
      });
      return '';
    };

    View$Base.prototype.T_if_true = function(attrs, content) {
      if (this.N[attrs.name]) {
        return this.handleIt(content());
      } else {
        return '';
      }
    };

    View$Base.prototype.T_if_false = function(attrs, content) {
      if (this.N[attrs.name]) {
        return '';
      } else {
        return this.handleIt(content);
      }
    };

    View$Base.prototype.T_if = function(attrs, content) {
      var is_true, issue, tbl, _ref, _ref1;
      issue = false;
      is_true = false;
      if ('val' in attrs) {
        if ('eq' in attrs) {
          if (attrs.val === attrs.eq) {
            is_true = true;
          }
        } else if ('ne' in attrs) {
          if (attrs.val !== attrs.ne) {
            is_true = true;
          }
        } else if ('gt' in attrs) {
          if (attrs.val > attrs.gt) {
            is_true = true;
          }
        } else if ('in_list' in attrs) {
          if (_ref = attrs.val, __indexOf.call(attrs.in_list.split(','), _ref) >= 0) {
            is_true = true;
          }
        } else if ('not_in_list' in attrs) {
          if (_ref1 = attrs.val, __indexOf.call(attrs.not_in_list.split(','), _ref1) < 0) {
            is_true = true;
          }
        } else {
          issue = true;
        }
      } else if ('set' in attrs) {
        is_true = attrs.set ? true : false;
      } else if ('not_set' in attrs) {
        is_true = attrs.not_set ? false : true;
      } else if ('table_is_empty' in attrs) {
        tbl = this._accessModelTable(attrs.table_is_empty, false);
        if (!tbl.length) {
          is_true = true;
        }
      } else if ('table_is_not_empty' in attrs) {
        tbl = this._accessModelTable(attrs.table_is_not_empty, false);
        if (tbl.length) {
          is_true = true;
        }
      } else {
        issue = true;
      }
      if (issue) {
        console.log('ISSUE T_if', attrs);
      }
      if ('name' in attrs) {
        this.N[attrs.name] = is_true;
      }
      if (is_true && content) {
        return this.handleIt(content);
      } else {
        return '';
      }
    };

    View$Base.prototype._accessModelTable = function(at_table, alias) {
      var lh, rh, rh_alias, root, tbl, _ref;
      _ref = at_table.split('/'), lh = _ref[0], rh = _ref[1];
      if (lh in this.R) {
        tbl = this.R[lh][rh];
        root = {
          p: lh
        };
      } else {
        tbl = E[lh](rh);
        root = {
          m: lh
        };
      }
      if (alias === false) {
        return tbl;
      }
      rh_alias = alias != null ? alias : rh;
      if (tbl.length === 0) {
        return [tbl, rh_alias];
      }
      root.o = rh;
      this.I[rh_alias] = root;
      return [tbl, rh_alias];
    };

    View$Base.prototype.T_foreach = function(attrs, content_f) {
      var count, f, limit, result, rh_alias, row, tbl, _i, _len, _ref;
      f = 'T_foreach';
      _ref = this._accessModelTable(attrs.table, attrs.alias), tbl = _ref[0], rh_alias = _ref[1];
      if (tbl.length === 0) {
        return '';
      }
      result = [];
      limit = 'limit' in attrs ? Number(attrs.limit) - 1 : tbl.length;
      for (count = _i = 0, _len = tbl.length; _i < _len; count = ++_i) {
        row = tbl[count];
        row = tbl[count];
        row._ = {
          count: count,
          first: count === 0,
          last: count === limit - 1,
          "break": false
        };
        this.R[rh_alias] = row;
        this.I[rh_alias].c = count;
        result.push(this.handleIt(content_f));
      }
      delete this.I[rh_alias];
      delete this.R[rh_alias];
      return result;
    };

    View$Base.prototype.T_fist = function(attrs, content_f) {
      var ans, content, f, fist, foreach_attrs, masterAlias, model, part, rh_1, rh_alias, subTable, table, tbl, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7,
        _this = this;
      f = 'T_fist';
      _log2(f, attrs, content_f);
      fist = E.fistDef[attrs.fist];
      model = (_ref = fist.event) != null ? _ref : 'Fist';
      table = attrs.fist + (attrs.row != null ? ':' + attrs.row : '');
      subTable = (_ref1 = (_ref2 = attrs.via) != null ? _ref2 : fist.via) != null ? _ref1 : 'Control';
      masterAlias = 'Fist';
      _ref3 = this._accessModelTable(model + '/' + table, masterAlias), tbl = _ref3[0], rh_alias = _ref3[1];
      _log2(f, 'tbl,rh_alias (master)', tbl, rh_alias);
      this.R[rh_alias] = tbl[0];
      this.I[rh_alias].c = 0;
      rh_1 = rh_alias;
      content = content_f ? content_f : (part = (_ref4 = (_ref5 = attrs.part) != null ? _ref5 : fist.part) != null ? _ref4 : 'fist_default', (_ref6 = attrs.part) != null ? _ref6 : attrs.part = (_ref7 = fist.part) != null ? _ref7 : 'fist_default', function() {
        return _this.kids([
          [
            'part', {
              part: part
            }
          ]
        ]);
      });
      foreach_attrs = {
        table: masterAlias + '/' + subTable
      };
      if (attrs.alias != null) {
        foreach_attrs.alias = attrs.alias;
      }
      ans = this.T_foreach(foreach_attrs, content);
      delete this.R[rh_1];
      delete this.I[rh_1];
      return ans;
    };

    View$Base.prototype.value = function(el) {
      if (el.value !== el.defaultValue) {
        return el.value = el.defaultValue;
      }
    };

    View$Base.prototype.A_at = function(orig_attrs) {
      var attrs, nm, parts, val, _results;
      attrs = E.merge({}, orig_attrs);
      _results = [];
      for (nm in attrs) {
        val = attrs[nm];
        if (!(nm[0] === 'e' && nm[2] === '-')) {
          continue;
        }
        parts = nm.split('-');
        _results.push(this['A_' + parts[0]](parts, val, attrs));
      }
      return _results;
    };

    View$Base.prototype.A_ea = function(parts, val, attrs) {
      var _ref, _ref1;
      if ((_ref = attrs.className) == null) {
        attrs.className = '';
      }
      return attrs.className += " " + ((_ref1 = parts[1]) != null ? _ref1 : 'click') + ":" + val;
    };

    View$Base.prototype.ex = function(el, isInit, ctx) {
      var attrs, d, e, f, ix, nm, p1, p2, val, _i, _ref, _ref1, _results;
      f = 'ex';
      attrs = el.attributes;
      _results = [];
      for (ix = _i = 0, _ref = attrs.length; 0 <= _ref ? _i < _ref : _i > _ref; ix = 0 <= _ref ? ++_i : --_i) {
        if (!('data-ex-' === attrs[ix].name.slice(0, 8))) {
          continue;
        }
        _ref1 = attrs[ix].name.split('-'), d = _ref1[0], e = _ref1[1], nm = _ref1[2], p1 = _ref1[3], p2 = _ref1[4];
        val = attrs[ix].value;
        _log2(f, attrs[ix].name, val, p1, p2);
        _results.push(E['ex$' + nm](el, isInit, ctx, val, p1, p2));
      }
      return _results;
    };

    return View$Base;

  })(E.ModelJS);

  E.Model.View$Base = View$Base;

  E.ex$value = function(el, isInit, ctx, val, p1, p2) {
    var f;
    f = 'A_ex_value';
    _log2(f, el.value, val, (el.value !== val ? 'CHANGE' : 'SAME'));
    if (el.value !== val) {
      return el.value = val;
    }
  };

  E.ex$timeago = function(el, isInit, ctx, val, p1, p2) {
    var doIt, re_doIt, un_doIt;
    un_doIt = function() {
      if (ctx.timer) {
        clearInterval(ctx.timer);
        return delete ctx.timer;
      }
    };
    doIt = function() {
      return el.textContent = $.timeago(val);
    };
    re_doIt = function() {
      un_doIt();
      return ctx.timer = setInterval(doIt, 60000);
    };
    doIt();
    re_doIt();
    if (isInit) {
      return ctx.onunload = un_doIt;
    }
  };

  E.ex$collapse = function(el, isInit, ctx, val, p1, p2) {
    var f, g, height, i, _ref;
    f = 'A_ex_collapse';
    _ref = val.split(':'), g = _ref[0], i = _ref[1];
    _log2(f, {
      g: g,
      i: i,
      sH: el.scrollHeight,
      g_row: (E.Tab(g))[0]
    });
    height = (E.Tab(g))[0][i] ? el.scrollHeight : 0;
    return el.style.height = (String(height)) + 'px';
  };

}).call(this);
