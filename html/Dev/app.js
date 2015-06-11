// Generated by CoffeeScript 1.4.0
(function() {
  var err, warn,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  warn = function(str, o) {
    return console.warn("WARNING", str, o != null ? o : '');
  };

  err = function(str, o) {
    console.error("ERROR", str, o != null ? o : '');
    throw new Error("ERROR: " + str);
  };

  window.EpicMvc.app$Dev = {
    OPTIONS: {
      warn: warn,
      err: err,
      c1: function(inAction) {
        if (inAction !== false) {
          return warn("IN CLICK");
        }
      },
      a1: function(view_name, aModels) {
        if (view_name in aModels) {
          return;
        }
        err("Could not find model (" + view_name + ") in namespace E.Model", aModels);
      },
      a2: function(view_name, aModels, attribute) {
        if (attribute in aModels[view_name]) {
          return;
        }
        err("Could not find model (" + view_name + ") in namespace E.Model", aModels);
      },
      ap1: function(path, flow, t, s) {
        if ((path.replace(/[^\/]+/g, '')).length !== 2) {
          err("App 'path' (" + path + ") must have exactly two slashes");
        }
        if (!flow || !(flow in E.aFlows)) {
          err("App 'path' (" + path + ") did not result in a valid 'flow' (" + flow + ").", {
            path: path,
            flow: flow,
            t: t,
            s: s
          });
        }
        if (!t) {
          t = E.appStartT(flow);
        }
        if (!t || !(t in E.aFlows[flow].TRACKS)) {
          err("App 'path' (" + path + ") did not result in a valid 'track' (" + t + ").", {
            path: path,
            flow: flow,
            t: t,
            s: s
          });
        }
        if (!s) {
          s = E.appStartS(flow, t);
        }
        if (!s || !(s in E.aFlows[flow].TRACKS[t].STEPS)) {
          err("App 'path' (" + path + ") did not result in a valid 'step' (" + s + ").", {
            path: path,
            flow: flow,
            t: t,
            s: s
          });
        }
      },
      m1: function(view, model) {
        if (model["class"] in E.Model) {
          return;
        }
        err("Processing view (" + view + "), model-class (" + model["class"] + ") not in namespace E.Model", model);
      },
      m2: function(view_nm, act, parms) {
        err("Model (" + view_nm + ").action() didn't know action (" + act + ")");
      },
      m3: function(view_nm, tbl_nm, table) {
        if (tbl_nm in table) {
          return;
        }
        err("Model (" + view_nm + ").loadTable() didn't know table-name (" + tbl_nm + ")");
      },
      m4: function(view_nm, fistNm, row) {
        err("Model (" + view_nm + ").fistValidate() didn't know FIST (" + fistNm + ")");
      },
      m5: function(view_nm, fistNm, row) {
        err("Model (" + view_nm + ").fistGetValues() didn't know FIST (" + fistNm + ")");
      },
      m6: function(view_nm, fistNm, fieldNm, row) {
        err("Model (" + view_nm + ").fistGetChoices() did't know FIST-FIELD (" + fistNm + "-" + fieldNm + ")");
      },
      ca1: function(action_token, original_path, action_node) {
        if (action_node != null) {
          return;
        }
        warn("No app. entry for action_token (" + action_token + ") on path (" + original_path + ")");
      },
      ca2: function(action_token, original_path, nms, data, action_node) {
        var nm, _i, _len;
        for (_i = 0, _len = nms.length; _i < _len; _i++) {
          nm = nms[_i];
          if (!(nm in data)) {
            warn("Missing param (" + nm + ") for action (" + action_token + "), Path: " + original_path, {
              data: data,
              action_node: action_node
            });
          }
        }
      },
      ca3: function(action_token, original_path, action_node, aMacros) {
        if (action_node["do"] in aMacros) {
          return;
        }
        err("Missing (" + action_node["do"] + ") from MACROS; Action: (" + action_token + "), Path: (" + original_path + ")");
      },
      ca4: function(action_token, original_path, action_node, what) {
        if (action_node[what] in E.fistDef) {
          return;
        }
        err("Unknown Fist for '" + what + ":' " + action_node[what] + "); Action: (" + action_token + "), Path: (" + original_path + ")", {
          action_node: action_node
        });
      },
      fi1: function(fist) {
        var fieldNm, fistNm, model, _i, _len, _ref;
        fistNm = fist.nm;
        model = E.appFist(fistNm);
        if (!(model != null)) {
          err("FIST is missing: app.js requires MODELS: <model-name>: fists:[...,'" + fistNm + "']", {
            fist: fist
          });
        }
        if (!fist.sp.FIELDS) {
          err("FIELDS attribute missing from FIST definition");
        }
        _ref = fist.sp.FIELDS;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fieldNm = _ref[_i];
          if (!(fieldNm in E.fieldDef)) {
            err("No such FIELD (" + fieldNm + ") found for FIST (" + fistNm + ")", {
              fist: fist
            });
          }
        }
      },
      fi2: function(field, fist) {
        var attr, familiar_types, filt, filtList, filtNm, str, type, _i, _j, _len, _len1, _ref, _ref1, _ref2;
        str = "in FIELD (" + field.fieldNm + ") for FIST (" + field.fistNm + ")";
        _ref = ['h2h', 'd2h', 'h2d', 'validate'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          if (!(attr in field)) {
            continue;
          }
          type = attr === 'validate' ? 'VAL' : attr.toUpperCase();
          filtList = attr === 'h2h' ? field[attr] : [field[attr]];
          for (_j = 0, _len1 = filtList.length; _j < _len1; _j++) {
            filtNm = filtList[_j];
            if (filtNm && !((filt = 'fist' + type + '$' + filtNm) in E)) {
              err("Missing Fist Filter (E." + filt + ") " + str, {
                field: field
              });
            }
          }
        }
        if (!('type' in field)) {
          err("'type' attribute missing " + str);
        }
        if (!('db_nm' in field)) {
          err("'db_nm' attribute missing " + str);
        }
        familiar_types = ['radio', 'pulldown', 'text', 'textarea', 'password', 'hidden', 'yesno'];
        if (_ref1 = (field.type.split(':'))[0], __indexOf.call(familiar_types, _ref1) < 0) {
          warn("Unfamiliar 'type' attribute " + str);
        }
        if (field.confirm != null) {
          if (_ref2 = field.confirm, __indexOf.call(fist.sp.FIELDS, _ref2) < 0) {
            err("Missing Confirm FIELD (" + field.confirm + ") in FIST FIELDS " + str);
          }
          if (!(field.confirm in E.fieldDef)) {
            err("No such Confirm FIELD (" + field.confirm + ") found " + str);
          }
        }
      },
      fi3: function(field, val) {
        if (val != null) {
          return;
        }
        warn("FIST field value is undefined in FIELD (" + field.fieldNm + ") for FIST (" + field.fistNm + ")", {
          field: field
        });
      },
      fi4: function(type, fist, field) {
        err("Unknown pulldown/radio option (" + type + ") in FIELD " + field.fieldNm + " for FIST " + field.fistNm + ".", {
          field: field
        });
      },
      v1: function(val, spec) {
        err("Unknown variable specification/filter (#" + spec + ")");
        return val != null ? val : '';
      },
      w1: function(wistNm) {
        if (wistNm in E.wistDef) {
          return;
        }
        err("Unknown Wist (" + wistNm + ").");
      },
      v1: function(nm, attr) {
        if ('ex$' + nm in E) {
          return;
        }
        err("Unknown Mithril extension function (E.ex$" + nm + ") using attribute: " + attr + ".");
      }
    },
    SETTINGS: {
      frames: {
        MMM_Dev: 'bdevl'
      }
    },
    MODELS: {
      Devl: {
        "class": "Devl$Dev",
        inst: "iDev_Devl"
      },
      View: {
        "class": "View$Dev",
        inst: "iDev_View"
      }
    },
    ACTIONS: {
      dbg_toggle: {
        "do": 'Devl.toggle',
        pass: 'what'
      },
      dbg_refresh: {
        "do": 'Devl.clear_cache'
      },
      dbg_open_model: {
        "do": 'Devl.open_model',
        pass: 'name'
      },
      dbg_open_table: {
        "do": 'Devl.open_table',
        pass: 'name'
      },
      dbg_open_subtable: {
        "do": 'Devl.open_subtable',
        pass: 'name'
      },
      dbg_close_subtable: {
        "do": 'Devl.close_subtable'
      },
      dbg_table_left: {
        "do": 'Devl.table_left'
      },
      dbg_table_right: {
        "do": 'Devl.table_right'
      },
      dbg_table_col_set: {
        "do": 'Devl.table_col_set',
        pass: 'col'
      },
      dbg_table_by_row: {
        "do": 'Devl.table_row_set'
      }
    }
  };

}).call(this);
