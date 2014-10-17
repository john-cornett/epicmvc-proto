// Generated by CoffeeScript 1.4.0
(function() {
  var err, warn;

  warn = function(str, o) {
    return console.warn("WARNING", str, o != null ? o : '');
  };

  err = function(str, o) {
    console.error("ERROR", str, o != null ? o : '');
    throw new Error("ERROR: " + str);
  };

  window.EpicMvc.app$Dev = {
    OPTIONS: {
      c1: function(inAction) {
        if (inAction !== false) {
          return warn("IN CLICK");
        }
      },
      a1: function(view_name, aModels) {
        if (view_name in aModels) {
          return;
        }
        return err("Could not find model (" + view_name + ") in namespace E.Model", aModels);
      },
      a2: function(view_name, aModels, attribute) {
        if (attribute in aModels[view_name]) {
          return;
        }
        return err("Could not find model (" + view_name + ") in namespace E.Model", aModels);
      },
      m1: function(view, model) {
        if (model["class"] in E.Model) {
          return;
        }
        return err("Processing view (" + view + "), model-class (" + model["class"] + ") not in namespace E.Model", model);
      },
      ca1: function(action_token, original_path, action_node) {
        if (action_node != null) {
          return;
        }
        return warn("No app. entry for action_token (" + action_token + ") on path (" + original_path + ")");
      },
      ca2: function(action_token, original_path, nms, data, action_node) {
        var nm, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = nms.length; _i < _len; _i++) {
          nm = nms[_i];
          if (!(nm in data)) {
            _results.push(warn("Missing param (" + nm + ") for action (" + action_token + "), Path: " + original_path, {
              data: data,
              action_node: action_node
            }));
          }
        }
        return _results;
      },
      ca3: function(action_token, original_path, action_node, aMacros) {
        if (action_node["do"] in aMacros) {
          return;
        }
        return err("Missing (" + action_node["do"] + ") from MACROS; Action: (" + action_token + "), Path: (" + original_path + ")");
      },
      ca4: function(action_token, original_path, action_node, what) {
        if (action_node[what] in E.fistDef) {
          return;
        }
        return err("Unknown Fist for '" + what + ":' " + action_node[what] + "); Action: (" + action_token + "), Path: (" + original_path + ")", {
          action_node: action_node
        });
      },
      fi1: function(fist) {
        var fistNm, model;
        fistNm = fist.nm;
        model = E.appFist(fistNm);
        if (!(model != null)) {
          return err("FIST is missing: app.js requires MODELS: <model-name>: fists:[...,'" + fistNm + "']", {
            fist: fist
          });
        }
      },
      fi2: function(field) {
        var attr, filt, _i, _len, _ref, _results;
        _ref = ['h2h', 'd2h', 'h2d', 'validate'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          if (!(attr in field)) {
            continue;
          }
          filt = 'fist' + (attr === 'validate' ? 'VAL' : attr.toUpperCase()) + '$' + field[attr];
          if (!(filt in E)) {
            _results.push(err("Missing Fist Filter (E." + filt + ") in FIELD (" + field.fieldNm + ") for FIST (" + field.fistNm + ")", {
              field: field
            }));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      fi3: function(field, val) {
        if (val != null) {
          return;
        }
        return warn("FIST field value is undefined in FIELD (" + field.fieldNm + ") for FIST (" + field.fistNm + ")", {
          field: field
        });
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
