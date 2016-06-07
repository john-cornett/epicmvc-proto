// Generated by CoffeeScript 1.4.0
(function() {
  var Devl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Devl = (function(_super) {

    __extends(Devl, _super);

    function Devl(Epic, view_nm) {
      Devl.__super__.constructor.call(this, Epic, view_nm);
      this.opts = {
        file: false,
        tag: false,
        tag2: false,
        form: false,
        model: false,
        stack: false
      };
      this.open_model = '';
      this.open_table = '';
      this.open_table_stack = [];
      this.table_row_cnt = 0;
      this.table_by_col = false;
      this.table_col = false;
    }

    Devl.prototype.eventNewRequest = function() {
      var _this = this;
      this.invalidateTables(true);
      return setTimeout((function() {
        return _this.invalidateTables(true);
      }), 2000);
    };

    Devl.prototype.action = function(act, p) {
      var dummy, f, i, incr, m, r, _ref;
      f = 'dM:Devl(' + act + ')';
      r = {};
      i = new window.EpicMvc.Issue(this.Epic);
      m = new window.EpicMvc.Issue(this.Epic);
      switch (act) {
        case 'toggle':
          this.opts[p.what] = !this.opts[p.what];
          break;
        case 'clear_cache':
          this.Epic.loader.clearCache();
          break;
        case 'open_model':
          if (this.open_model !== p.name) {
            this.open_model = p.name;
            this.open_table = '';
            this.open_table_stack = [];
          } else {
            this.open_model = '';
          }
          delete this.Table.Model;
          break;
        case 'close_subtable':
          if (!this.open_table_stack.length) {
            return;
          }
          _ref = this.open_table_stack.pop(), dummy = _ref[0], this.table_row_cnt = _ref[1], this.table_by_col = _ref[2], this.table_col = _ref[3];
          delete this.Table.Model;
          break;
        case 'open_subtable':
          this.open_table_stack.push([p.name, this.table_row_cnt, this.table_by_col, this.table_col]);
          this.table_row_cnt = 0;
          this.table_by_col = false;
          this.table_col = false;
          delete this.Table.Model;
          break;
        case 'open_table':
          if (this.open_table !== p.name) {
            this.table_row_cnt = 0;
            this.table_by_col = false;
            this.table_col = false;
            this.open_table = p.name;
            this.open_table_stack = [];
          } else {
            this.open_table = '';
          }
          delete this.Table.Model;
          break;
        case 'table_row_set':
          this.table_by_col = false;
          if (p.row != null) {
            this.table_row_cnt = p.row;
          }
          break;
        case 'table_col_set':
          this.table_col = p.col;
          this.table_by_col = true;
          break;
        case 'table_left':
        case 'table_right':
          incr = act === 'table_left' ? -1 : 1;
          _log2(f, act, incr, this.table_row_cnt);
          this.table_row_cnt += incr;
          delete this.Table.Model;
          break;
        default:
          return Devl.__super__.action.call(this, act, p);
      }
      return [r, i, m];
    };

    Devl.prototype.loadTable = function(tbl_nm) {
      var cols, f, inst, is_sub, len, nm, open, rcol, rec, rec_s, row, row_inx, rrow, rval, sub_tnm, table, tnm, tnm_s, tref, trow, _i, _len, _ref, _ref1;
      f = 'dM:Devl.loadTable(' + tbl_nm + ')';
      switch (tbl_nm) {
        case 'Opts':
          return this.Table[tbl_nm] = [this.opts];
        case 'Model':
          table = [];
          for (inst in this.Epic.oModel) {
            nm = this.Epic.oModel[inst].view_nm;
            row = $.extend({
              is_open: '',
              Table: []
            }, {
              inst: inst,
              name: nm
            });
            if (nm === this.open_model) {
              row.is_open = 'yes';
            }
            _ref = this.Epic.oModel[inst].Table;
            for (tnm in _ref) {
              rec = _ref[tnm];
              tnm_s = tnm;
              rec_s = rec;
              open = false;
              is_sub = false;
              if (row.is_open === 'yes' && tnm === this.open_table) {
                open = true;
                if (this.open_table_stack.length) {
                  _ref1 = this.open_table_stack;
                  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                    tref = _ref1[_i];
                    sub_tnm = tref[0], row_inx = tref[1];
                    if (!(row_inx in rec_s) || !(sub_tnm in rec_s[row_inx])) {
                      break;
                    }
                    is_sub = true;
                    rec_s = rec_s[row_inx][sub_tnm];
                    tnm_s += ',' + sub_tnm;
                  }
                }
              }
              len = rec_s.length;
              trow = {
                is_open: open,
                is_sub: is_sub,
                name: tnm_s,
                rows: len,
                Cols: [],
                row_cnt: 0,
                col: '',
                curr_col: this.table_col,
                by_col: this.table_by_col
              };
              if (open) {
                if (this.table_row_cnt < 0) {
                  this.table_row_cnt = len - 1;
                }
                if (this.table_row_cnt > len - 1) {
                  this.table_row_cnt = 0;
                }
                trow.row_cnt = this.table_row_cnt;
              }
              if (len) {
                cols = (function() {
                  var _results;
                  _results = [];
                  for (rcol in rec_s[0]) {
                    _results.push(rcol);
                  }
                  return _results;
                })();
              } else {
                cols = [];
              }
              trow.cols = len ? cols.join(', ') : 'no rows';
              if (len && open) {
                if (!this.table_by_col) {
                  trow.Cols = (function() {
                    var _ref2, _results;
                    _ref2 = rec_s[this.table_row_cnt];
                    _results = [];
                    for (rcol in _ref2) {
                      rval = _ref2[rcol];
                      _results.push({
                        type: (rval === null ? 'Null' : typeof rval),
                        col_ix: cols.indexOf(rcol),
                        col: rcol,
                        len: rval != null ? rval.length : void 0,
                        val: rval != null ? rval : '???'
                      });
                    }
                    return _results;
                  }).call(this);
                } else {
                  trow.Rows = (function() {
                    var _ref2, _ref3, _results;
                    _results = [];
                    for (rrow in rec_s) {
                      _results.push({
                        row: rrow,
                        len: (_ref2 = rec_s[rrow][this.table_col]) != null ? _ref2.length : void 0,
                        type: (rec_s[rrow][this.table_col] === null ? 'Null' : typeof rec_s[rrow][this.table_col]),
                        val: (_ref3 = rec_s[rrow][this.table_col]) != null ? _ref3 : '???'
                      });
                    }
                    return _results;
                  }).call(this);
                }
              }
              row.Table.push(trow);
            }
            row.tables = row.Table.length;
            table.push(row);
            table.sort(function(a, b) {
              if (a.inst === b.inst) {
                return 0;
              } else if (a.inst > b.inst) {
                return 1;
              } else {
                return -1;
              }
            });
          }
          _log2(f, 'final', table);
          return this.Table[tbl_nm] = table;
        default:
          return Devl.__super__.loadTable.call(this, tbl_nm);
      }
    };

    return Devl;

  })(window.EpicMvc.ModelJS);

  window.EpicMvc.Model.Devl$BaseDevl = Devl;

}).call(this);
