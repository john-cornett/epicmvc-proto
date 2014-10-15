// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var Issue, ModelJS, app, klass, nm, w, _ref,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  app = function(window, undef) {
    var E, Extra, Model, aActions, aFists, aFlows, aMacros, aModels, aSetting, action, appFindAction, appFindAttr, appFindNode, appFist, appGetF, appGetS, appGetSetting, appGetT, appGetVars, appInit, appLoadFormsIf, appModel, appStartS, appStartT, appconfs, counter, doAction, fieldDef, finish_logout, fistDef, fistInit, inAction, issueInit, issueMap, make_model_functions, merge, nm, oModel, obj, option, setModelState, type_oau, _d_doAction, _ref;
    inAction = false;
    counter = 0;
    Model = {};
    Extra = {};
    oModel = {};
    appconfs = [];
    option = {
      loadDirs: {}
    };
    E = {};
    E.nextCounter = function() {
      return ++counter;
    };
    type_oau = function(obj) {
      return {}.toString.call(obj)[8];
    };
    merge = function() {
      var atype, depth, dest, dup, f, func, otype, source, sources, stype, utype, _i, _len;
      dest = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      otype = 'O';
      atype = 'A';
      utype = 'U';
      stype = 'S';
      depth = 0;
      func = {};
      func[otype] = function(dest, source) {
        var ans, f, snm;
        f = 'func:O';
        if ((type_oau(source)) !== otype) {
          return undef;
        }
        for (snm in source) {
          ans = dup(dest[snm], source[snm]);
          if (ans !== undef) {
            dest[snm] = ans;
          }
        }
        return undef;
      };
      func[atype] = function(dest, source) {
        var ans, f, inx, s, _i, _len;
        f = 'func:A';
        if ((type_oau(source)) !== atype) {
          reutrn(undef);
        }
        for (inx = _i = 0, _len = source.length; _i < _len; inx = ++_i) {
          s = source[inx];
          ans = dup(dest[inx], s);
          if (ans !== undef) {
            dest[inx] = ans;
          }
        }
        return undef;
      };
      func[utype] = function(was, want) {
        var become, f;
        f = 'func:U';
        switch (type_oau(want)) {
          case otype:
            become = {};
            func[otype](become, want);
            break;
          case atype:
            become = [];
            func[atype](become, want);
            break;
          default:
            become = want;
        }
        return become;
      };
      func[stype] = function(was, want) {
        if ((type_oau(want)) in func) {
          return want;
        }
        return was;
      };
      dup = function(dest, source) {
        var r, type;
        depth++;
        type = type_oau(dest);
        if (!(type in func)) {
          type = stype;
        }
        r = func[type](dest, source);
        depth--;
        return r;
      };
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        f = ':merge:source-loop';
        dup(dest, source);
      }
      return dest;
    };
    E.login = function() {
      var f, k, o, _results;
      f = ':login';
      _log2(f, oModel);
      _results = [];
      for (k in oModel) {
        o = oModel[k];
        _results.push(typeof o.eventLogin === "function" ? o.eventLogin() : void 0);
      }
      return _results;
    };
    E.logout = function(action_event, action_data) {
      var _this = this;
      if (inAction !== false) {
        setTimeout((function() {
          return E.logout(action_event, action_data);
        }), 100);
        return;
      }
      if (action_event) {
        return (action(action_event, action_data)).then(function() {
          return finish_logout();
        });
      } else {
        return finish_logout();
      }
    };
    finish_logout = function() {
      var k, o, _results;
      _results = [];
      for (k in oModel) {
        o = oModel[k];
        if (!(typeof o.eventLogout === "function" ? o.eventLogout() : void 0)) {
          continue;
        }
        delete modelState[k];
        _results.push(delete oModel[k]);
      }
      return _results;
    };
    E.run = function(set_appconfs, more_options, init_func) {
      var promise;
      appconfs = set_appconfs;
      appInit();
      merge(option, more_options);
      E.oLoader = new Extra[option.loader](appconfs);
      promise = E.oLoader.D_loadAsync();
      promise.then(function() {
        fistInit();
        issueInit();
        if (typeof init_func === 'function') {
          init_func();
        }
        E.App().go(aSetting.go);
        return E.oRender = new Extra[option.render];
      });
    };
    action = function(action_token, data) {
      var f;
      f = ':action:' + action_token;
      _log2(f, data);
      if (inAction !== false) {
        if (typeof option.c1 === "function") {
          option.c1();
        }
      }
      inAction = action_token;
      m.startComputation();
      return (doAction(action_token, data, E.App().getStepPath())).then(function(action_result) {
        var k, modelState, o, ss;
        E.App().setIssues(action_result[0]);
        E.App().setMessages(action_result[1]);
        inAction = false;
        modelState = {};
        for (k in oModel) {
          o = oModel[k];
          if ((o.saveState != null) && (ss = o.saveState())) {
            modelState[k] = ss;
          }
        }
        return m.endComputation();
      });
    };
    setModelState = function(s) {
      var f, inst_nm, modelState, _base, _results;
      f = ':setModelState';
      if (s != null) {
        modelState = s;
      }
      _results = [];
      for (inst_nm in oModel) {
        _results.push(typeof (_base = oModel[inst_nm]).restoreState === "function" ? _base.restoreState(modelState[inst_nm]) : void 0);
      }
      return _results;
    };
    aSetting = {
      frames: {},
      modals: {},
      layout: 'default',
      go: 'default//'
    };
    aMacros = {};
    aActions = {};
    aFlows = {
      "default": {
        start: 'default',
        TRACKS: {
          "default": {
            start: 'default',
            STEPS: {
              "default": {}
            }
          }
        }
      }
    };
    aModels = {};
    aFists = {};
    appLoadFormsIf = function(config) {};
    appInit = function() {
      var form_nm, hash, nm, node, obj, view_nm, _i, _j, _len, _len1, _ref, _ref1;
      for (_i = 0, _len = appconfs.length; _i < _len; _i++) {
        nm = appconfs[_i];
        app = (_ref = E['app$' + nm]) != null ? _ref : {};
        if (app.STEPS) {
          merge(aFlows["default"].TRACKS["default"].STEPS, app.STEPS);
        }
        if (app.TRACKS) {
          merge(aFlows["default"].TRACKS, app.TRACKS);
        }
        hash = {
          SETTINGS: aSetting,
          MACROS: aMacros,
          ACTIONS: aActions,
          FLOWS: aFlows,
          MODELS: aModels,
          OPTIONS: option
        };
        for (nm in hash) {
          obj = hash[nm];
          merge(obj, app[nm]);
        }
      }
      for (view_nm in aModels) {
        node = aModels[view_nm];
        if (node.fists) {
          _ref1 = node.fists;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            form_nm = _ref1[_j];
            aFists[form_nm] = view_nm;
          }
        }
      }
      make_model_functions();
    };
    appModel = function(view_name, attribute) {
      if (!(view_name in aModels)) {
        config.a1(view_name);
      }
      if (!(attribute in aModels[view_name])) {
        option.a2(view_name, attribute);
      }
      return aModels[view_name][attribute];
    };
    appFist = function(fist_nm) {
      return aFists[fist_nm];
    };
    appFindNode = function(flow, t, s, cat, nm) {
      var ncat, nf, ns, nt, _ref, _ref1, _ref2, _ref3, _ref4;
      nf = aFlows[flow];
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
      return null;
    };
    appFindAttr = function(flow, t, s, attr) {
      var nattr, nf, ns, nt, _ref, _ref1;
      nf = aFlows[flow];
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
      return null;
    };
    appGetF = function(flow) {
      return aFlows[flow];
    };
    appGetT = function(flow, track) {
      return aFlows[flow].TRACKS[track];
    };
    appGetS = function(flow, track, step) {
      return aFlows[flow].TRACKS[track].STEPS[step];
    };
    appStartT = function(flow) {
      return appGetF(flow).start;
    };
    appStartS = function(flow, track) {
      return appGetT(flow, track).start;
    };
    appFindAction = function(path, action_token) {
      var _ref;
      return (_ref = appFindNode(path[0], path[1], path[2], 'ACTIONS', action_token)) != null ? _ref : aActions[action_token];
    };
    appGetSetting = function(setting_name, flow, track, step) {
      var _ref;
      if (!flow) {
        return aSetting[setting_name];
      }
      return (_ref = appFindAttr(flow, track, step != null ? step : false, setting_name)) != null ? _ref : aSetting[setting_name];
    };
    appGetVars = function(flow, track, step) {
      var f, k, v, vars;
      f = ':appGetVars';
      vars = merge({}, aFlows[flow].v, aFlows[flow].TRACKS[track].v, aFlows[flow].TRACKS[track].STEPS[step].v);
      _log2(f, ((function() {
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
    make_model_functions = function() {
      var model, view, _results;
      _results = [];
      for (view in aModels) {
        model = aModels[view];
        _results.push((function(view, model) {
          return E[view] = function(table_or_ctx, act_if_action, data) {
            var cls, inst_nm, oM;
            inst_nm = model.inst;
            if (!(inst_nm in oModel)) {
              cls = model["class"];
              if (!(E.Model[cls] != null)) {
                option.m1(view, model);
              }
              oModel[inst_nm] = new E.Model[cls](view, model.options);
              if (inst_nm in oModel) {
                oModel[inst_nm].restoreState(oModel[inst_nm]);
              }
            }
            oM = oModel[inst_nm];
            if (table_or_ctx === undef) {
              return oM;
            }
            if (act_if_action === undef) {
              return oM.getTable(table_or_ctx);
            }
            return oM.action(table_or_ctx, act_if_action, data);
          };
        })(view, model));
      }
      return _results;
    };
    doAction = function(action_token, data, original_path) {
      var d;
      d = new m.Deferred();
      d.resolve(_d_doAction(action_token, data, original_path));
      return d.promise;
    };
    _d_doAction = function(action_token, data, original_path) {
      var action_node, doActionNode, doLeftSide, doRightSide, f, master_data, master_issue, master_message;
      f = ":doAction(" + action_token + ")";
      _log2(f, data, original_path);
      master_issue = new Issue('App');
      master_message = new Issue('App');
      master_data = merge({}, data);
      action_node = appFindAction(original_path, action_token);
      _log2(f, action_node);
      if (!(action_node != null)) {
        _log2('WARNING', "No app. entry for action_token (" + action_token + ") on path (" + original_path + ")");
        return [master_issue, master_message];
      }
      doLeftSide = function(action_node) {
        var ctx, d, i, is_macro, mg, nm, nms, r, val, view_act, view_nm, _i, _len, _ref, _ref1, _ref2;
        _log2(f, 'doLeftSide:', {
          action_node: action_node
        });
        if (action_node.go != null) {
          E.App().go(action_node.go);
        }
        nms = (function() {
          switch (type_oau(action_node.pass)) {
            case 'A':
              return action_node.pass;
            case 'S':
              return action_node.pass.split(',');
            default:
              return [];
          }
        })();
        for (_i = 0, _len = nms.length; _i < _len; _i++) {
          nm = nms[_i];
          if (!(nm in data)) {
            _log2('WARNING', "Action (" + action_token + ") request data is missing param " + nm, data, action_node, original_path);
          }
        }
        _ref = action_node.set;
        for (nm in _ref) {
          val = _ref[nm];
          master_data[nm] = val;
        }
        if (action_node["do"] != null) {
          is_macro = !/[.]/.test(action_node["do"]);
          if (is_macro) {
            if (!aMacros[action_node["do"]]) {
              if (typeof option.ca2 === "function") {
                option.ca2(action_token, original_path, action_node);
              }
            }
            if (is_macro) {
              return doActionNode(aMacros[action_node["do"]]);
            }
          }
          _ref1 = action_node["do"].split('.'), view_nm = _ref1[0], view_act = _ref1[1];
          view_act = view_act != null ? view_act : action_token;
          d = new m.Deferred();
          r = {};
          i = new E.Issue(view_nm, view_act);
          mg = new E.Issue(view_nm, view_act);
          ctx = {
            d: d,
            r: r,
            i: i,
            m: mg
          };
          E[view_nm](ctx, view_act, master_data);
          _ref2 = ctx.r;
          for (nm in _ref2) {
            val = _ref2[nm];
            master_data[nm] = val;
          }
          master_issue.addObj(ctx.i);
          return master_message.addObj(ctx.m);
        }
      };
      doRightSide = function(action_node) {
        var choice, k, matches, next_node, val, _i, _len, _ref, _ref1, _ref2, _ref3;
        next_node = null;
        _ref1 = (_ref = action_node.next) != null ? _ref : [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          choice = _ref1[_i];
          if (choice.when === 'default') {
            next_node = choice;
            break;
          }
          if ((typeof choice.when) === 'string' && choice.when === ((_ref2 = master_data.success) != null ? _ref2 : master_data.ok)) {
            next_node = choice;
            break;
          }
          matches = true;
          _ref3 = choice.when;
          for (k in _ref3) {
            val = _ref3[k];
            if (master_data[k] !== val) {
              matches = false;
              break;
            }
          }
          if (matches) {
            next_node = choice;
            break;
          }
        }
        if (next_node) {
          _log2(f, 'doRightSide:', {
            next_node: next_node
          });
          doActionNode(next_node);
        }
      };
      doActionNode = function(action_node) {
        doLeftSide(action_node);
        return doRightSide(action_node);
      };
      doActionNode(action_node);
      return [master_issue, master_message];
    };
    fieldDef = {};
    fistDef = {};
    fistInit = function() {
      var fist, nm, rec, _i, _len, _ref, _results;
      for (_i = 0, _len = appconfs.length; _i < _len; _i++) {
        nm = appconfs[_i];
        fist = (_ref = E['fist$' + nm]) != null ? _ref : {};
        if (fist.FIELDS) {
          merge(fieldDef, fist.FIELDS);
        }
        if (fist.FISTS) {
          merge(fistDef, fist.FISTS);
        }
      }
      for (nm in fistDef) {
        rec = fistDef[nm];
        rec.fistNm = nm;
      }
      _results = [];
      for (nm in fieldDef) {
        rec = fieldDef[nm];
        _results.push(rec.fieldNm = nm);
      }
      return _results;
    };
    issueMap = {};
    issueInit = function() {
      var issues, nm, _i, _len, _ref, _results;
      _results = [];
      for (_i = 0, _len = appconfs.length; _i < _len; _i++) {
        nm = appconfs[_i];
        issues = (_ref = E['issue$' + nm]) != null ? _ref : {};
        _results.push(merge(issueMap, issues));
      }
      return _results;
    };
    _ref = {
      type_oau: type_oau,
      Model: Model,
      Extra: Extra,
      option: option,
      action: action,
      merge: merge,
      appconfs: appconfs,
      appGetF: appGetF,
      appGetT: appGetT,
      appGetS: appGetS,
      appStartT: appStartT,
      appStartS: appStartS,
      appFindAction: appFindAction,
      appGetSetting: appGetSetting,
      appGetVars: appGetVars,
      appFist: appFist,
      fieldDef: fieldDef,
      fistDef: fistDef,
      issueMap: issueMap,
      oModel: oModel
    };
    for (nm in _ref) {
      obj = _ref[nm];
      E[nm] = obj;
    }
    return E;
  };

  Issue = (function() {

    function Issue(t_view, t_action) {
      this.t_view = t_view;
      this.t_action = t_action;
      this.issue_list = [];
    }

    Issue.Make = function(view, token, value_list) {
      var issue;
      issue = new Issue(view);
      issue.add(token, value_list);
      return issue;
    };

    Issue.prototype.add = function(token, msgs) {
      var f;
      f = ':Issue.add:' + this.t_view + ':' + this.t_action;
      _log2(f, 'params:type/msgs', token, msgs);
      switch (typeof msgs) {
        case 'undefined':
          msgs = [];
          break;
        case 'string':
          msgs = [msgs];
      }
      return this.issue_list.push({
        token: token,
        more: msgs,
        t_view: this.t_view,
        t_action: this.t_action
      });
    };

    Issue.prototype.addObj = function(issue_obj) {
      var f, issue, new_issue, _i, _len, _ref, _ref1, _ref2;
      f = ':Issue.addObj:' + this.t_view + '#' + this.t_action;
      if (typeof issue_obj !== 'object' || !('issue_list' in issue_obj)) {
        return;
      }
      _ref = issue_obj.issue_list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        issue = _ref[_i];
        new_issue = E.merge({}, issue);
        if ((_ref1 = new_issue.t_view) == null) {
          new_issue.t_view = this.t_view;
        }
        if ((_ref2 = new_issue.t_action) == null) {
          new_issue.t_action = this.t_action;
        }
        this.issue_list.push(new_issue);
      }
    };

    Issue.prototype.count = function() {
      return this.issue_list.length;
    };

    Issue.prototype.asTable = function() {
      var final, issue, _i, _len, _ref;
      final = [];
      _ref = this.issue_list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        issue = _ref[_i];
        final.push({
          token: issue.token,
          title: "" + issue.t_view + "#" + issue.t_action + "#" + issue.token + "#" + (issue.more.join(',')),
          issue: this.map(issue.t_view, issue.t_action, issue.token, issue.more)
        });
      }
      return final;
    };

    Issue.prototype.map = function(t_view, t_action, token, more) {
      var map, map_list, spec, sub_map, _i, _j, _len, _len1, _ref;
      map = E.issueMap;
      if (typeof map !== 'object') {
        return "(no map) " + t_view + "#" + t_action + "#" + token + "#" + (more.join(','));
      }
      map_list = [];
      if (t_view in map) {
        if (t_action in map[t_view]) {
          map_list.push(map[t_view][t_action]);
        }
        if ('default' in map[t_view]) {
          map_list.push(map[t_view]["default"]);
        }
      }
      if ('default' in map) {
        if (t_action in map["default"]) {
          map_list.push(map["default"][t_action]);
        }
        if ('default' in map["default"]) {
          map_list.push(map["default"]["default"]);
        }
      }
      for (_i = 0, _len = map_list.length; _i < _len; _i++) {
        sub_map = map_list[_i];
        _ref = sub_map || [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          spec = _ref[_j];
          if (token.match(spec[0])) {
            return this.doMap(token, spec[1], more, token);
          }
        }
      }
      return "(no match)" + t_view + "#" + t_action + "#" + token + "#" + (more.join(','));
    };

    Issue.prototype.doMap = function(token, pattern, vals) {
      var new_str;
      new_str = pattern.replace(/%([0-9])(?::([0-9]))?%/g, function(str, i1, i2, more) {
        if (i1 === '0') {
          return token;
        }
        if (i2) {
          return vals[i1 - 1] || vals[i2 - 1] || '';
        } else {
          return vals[i1 - 1] || '';
        }
      });
      return new_str;
    };

    return Issue;

  })();

  ModelJS = (function() {

    function ModelJS(view_nm, options, ss) {
      this.view_nm = view_nm;
      this.options = options;
      this._ModelJS = {
        ss: ss || false
      };
      this.restoreState(false);
    }

    ModelJS.prototype.getTable = function(tbl_nm) {
      this.loadTableIf(tbl_nm);
      return this.Table[tbl_nm];
    };

    ModelJS.prototype.loadTableIf = function(tbl_nm) {
      if (!(tbl_nm in this.Table)) {
        return this.loadTable(tbl_nm);
      }
    };

    ModelJS.prototype.restoreState = function(copy_of_state) {
      var key;
      if (this._ModelJS.ss != null) {
        for (key in this._ModelJS.ss) {
          delete this[key];
        }
      }
      if (this._ModelJS.ss != null) {
        E.merge(this, this._ModelJS.ss);
      }
      if (copy_of_state) {
        E.merge(this, copy_of_state);
      }
      return this.Table = {};
    };

    ModelJS.prototype.saveState = function() {
      var nm, ss, st;
      ss = this._ModelJS.ss;
      if (!ss) {
        return false;
      }
      st = {};
      for (nm in ss) {
        if (this[nm] !== ss[nm]) {
          st[nm] = this[nm];
        }
      }
      return E.merge({}, st);
    };

    ModelJS.prototype.invalidateTables = function(tbl_nms, not_tbl_names) {
      var deleted_tbl_nms, f, nm, _i, _len;
      f = ':ModelJS.invalidateTables~' + this.view_nm;
      _log2(f, tbl_nms, not_tbl_names);
      if (not_tbl_names == null) {
        not_tbl_names = [];
      }
      if (tbl_nms === true) {
        tbl_nms = (function() {
          var _results;
          _results = [];
          for (nm in this.Table) {
            if (!(__indexOf.call(not_tbl_names, nm) >= 0)) {
              _results.push(nm);
            }
          }
          return _results;
        }).call(this);
      }
      deleted_tbl_nms = [];
      for (_i = 0, _len = tbl_nms.length; _i < _len; _i++) {
        nm = tbl_nms[_i];
        if (nm in this.Table) {
          deleted_tbl_nms.push(nm);
          delete this.Table[nm];
        }
      }
      return E.View().invalidateTables(this.view_nm, tbl_nms, deleted_tbl_nms);
    };

    return ModelJS;

  })();

  w = typeof window !== "undefined" ? window : {};

  w.EpicMvc = w.E = new app(w);

  _ref = {
    Issue: Issue,
    ModelJS: ModelJS
  };
  for (nm in _ref) {
    klass = _ref[nm];
    w.E[nm] = klass;
  }

  w._log2 = function() {};

  w._log2 = Function.prototype.bind.call(console.log, console);

  if (typeof module !== "undefined" && module !== null) {
    module.exports = w.E;
  }

  if (typeof define === "function" && define.amd) {
    define(function() {
      return w.E;
    });
  }

}).call(this);
