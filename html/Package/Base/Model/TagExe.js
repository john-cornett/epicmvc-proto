// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var $, TagExe,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty;

  $ = window.jQuery;

  TagExe = (function() {

    function TagExe(Epic, view_nm) {
      this.Epic = Epic;
      this.view_nm = view_nm;
      this.viewExe = this.Epic.getView();
      this.resetForNextRequest();
    }

    TagExe.prototype.resetForNextRequest = function(state) {
      this.forms_included = {};
      this.fist_objects = {};
      this.info_foreach = {};
      this.info_if_nms = {};
      this.info_varGet3 = {};
      if (state) {
        return this.info_foreach = $.extend(true, {}, state);
      }
    };

    TagExe.prototype.formatFromSpec = function(val, spec, custom_spec) {
      var str, _base;
      switch (spec) {
        case '':
          return typeof (_base = window.EpicMvc).custom_filter === "function" ? _base.custom_filter(val, custom_spec) : void 0;
        case 'count':
          return val != null ? val.length : void 0;
        case 'bytes':
          return window.bytesToSize(Number(val));
        case 'uriencode':
          return encodeURIComponent(val);
        case 'esc':
          return window.EpicMvc.escape_html(val);
        case 'lc':
          return (String(val)).toLowerCase();
        case 'ucFirst':
          str = (String(str)).toLowerCase();
          return str.slice(0, 1).toUpperCase() + str.slice(1);
        default:
          if (spec != null ? spec.length : void 0) {
            if ((val === true || (typeof val === 'number' && val)) || (val != null ? val.length : void 0)) {
              return spec.substr(1).replace(new RegExp('[' + spec.substr(0, 1) + ']', 'g'), ' ');
            } else {
              return '';
            }
          } else {
            return val;
          }
      }
    };

    TagExe.prototype.varGet3 = function(view_nm, tbl_nm, key, format_spec, custom_spec) {
      var row, _base, _base1, _ref, _ref1;
      this.viewExe.haveTableRefrence(view_nm, tbl_nm);
      if ((_ref = (_base = this.info_varGet3)[view_nm]) == null) {
        _base[view_nm] = {};
      }
      row = ((_ref1 = (_base1 = this.info_varGet3[view_nm])[tbl_nm]) != null ? _ref1 : _base1[tbl_nm] = ((this.Epic.getInstance(view_nm)).getTable(tbl_nm))[0]);
      return this.formatFromSpec(row[key], format_spec, custom_spec);
    };

    TagExe.prototype.varGet2 = function(table_ref, col_nm, format_spec, custom_spec, sub_nm) {
      var ans;
      ans = this.info_foreach[table_ref].row[col_nm];
      if (sub_nm != null) {
        ans = ans[sub_nm];
      }
      return this.formatFromSpec(ans, format_spec, custom_spec);
    };

    TagExe.prototype.loadFistDef = function(flist_nm) {
      var _base, _ref;
      return (_ref = (_base = this.fist_objects)[flist_nm]) != null ? _ref : _base[flist_nm] = this.Epic.getFistInstance(flist_nm);
    };

    TagExe.prototype.checkForDynamic = function(oPt) {
      var attr, delay, id, plain_attrs, state, tag, val, _ref;
      tag = 'dynamic' in oPt.attrs ? this.viewExe.handleIt(oPt.attrs.dynamic) : '';
      if (tag.length === 0) {
        return ['', '', false];
      }
      delay = 1;
      id = 'epic-dynopart-' + this.Epic.nextCounter();
      plain_attrs = [];
      _ref = oPt.attrs;
      for (attr in _ref) {
        val = _ref[attr];
        switch (attr) {
          case 'part':
          case 'dynamic':
            continue;
          case 'delay':
            delay = this.viewExe.handleIt(val);
            break;
          case 'id':
            id = this.viewExe.handleIt(val);
            break;
          default:
            plain_attrs.push("" + attr + "=\"" + (this.viewExe.handleIt(val)) + "\"");
        }
      }
      state = $.extend(true, {}, this.info_foreach);
      return [
        "<" + tag + " id=\"" + id + "\" " + (plain_attrs.join(' ')) + ">", "</" + tag + ">", {
          id: id,
          delay: delay * 1000,
          state: state
        }
      ];
    };

    TagExe.prototype.Tag_page_part = function(oPt) {
      var after, before, dynamicInfo, f, _ref;
      f = ':tag.page-part:' + oPt.attrs.part;
      _ref = this.checkForDynamic(oPt), before = _ref[0], after = _ref[1], dynamicInfo = _ref[2];
      return before + (this.viewExe.includePart(this.viewExe.handleIt(oPt.attrs.part), dynamicInfo)) + after;
    };

    TagExe.prototype.Tag_page = function(oPt) {
      var after, before, dynamicInfo, _ref;
      _ref = this.checkForDynamic(oPt), before = _ref[0], after = _ref[1], dynamicInfo = _ref[2];
      return before + (this.viewExe.includePage(dynamicInfo)) + after;
    };

    TagExe.prototype.getTable = function(nm) {
      var f;
      f = ':TagExe.getTable:' + nm;
      this.Epic.log2(f, this.fist_table, this.info_if_nms);
      switch (nm) {
        case 'Control':
        case 'Form':
          return this.fist_table[nm];
        case 'If':
          return [this.info_if_nms];
        default:
          return [];
      }
    };

    TagExe.prototype.Tag_form_part = function(oPt) {
      var any_req, choices, fl, fl_nm, fm_nm, help, hpfl, issues, ix, oFi, one_field_nm, orig, out, part, rows, s, show_req, _i, _j, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      part = this.viewExe.handleIt((_ref = oPt.attrs.part) != null ? _ref : 'fist_default');
      fm_nm = this.viewExe.handleIt(oPt.attrs.form);
      oFi = this.loadFistDef(fm_nm);
      one_field_nm = oPt.attrs.field != null ? this.viewExe.handleIt(oPt.attrs.field) : false;
      help = this.viewExe.handleIt((_ref1 = oPt.attrs.help) != null ? _ref1 : '');
      show_req = 'show_req' in oPt.attrs ? this.viewExe.handleIt(oPt.attrs.show_req) : 'yes';
      any_req = false;
      out = [];
      hpfl = oFi.getHtmlPostedFieldsList(fm_nm);
      issues = oFi.getFieldIssues();
      for (_i = 0, _len = hpfl.length; _i < _len; _i++) {
        fl_nm = hpfl[_i];
        if (one_field_nm !== false && one_field_nm !== fl_nm) {
          continue;
        }
        orig = oFi.getFieldAttributes(fl_nm);
        fl = $.extend({}, orig);
        fl.req = fl.req === true ? 'yes' : '';
        if (fl.req === true) {
          any_req = true;
        }
        fl.name = fl_nm;
        if ((_ref2 = fl["default"]) == null) {
          fl["default"] = '';
        }
        fl["default"] = String(fl["default"]);
        fl.value = (_ref3 = oFi.getHtmlFieldValue(fl_nm)) != null ? _ref3 : fl["default"];
        fl.selected = fl.type === 'yesno' && fl.value === '1' ? 'yes' : '';
        fl.id = 'U' + this.Epic.nextCounter();
        fl.type = (fl.type.split(':'))[0];
        if ((_ref4 = fl.width) == null) {
          fl.width = '';
        }
        if (fl.type === 'radio' || fl.type === 'pulldown') {
          choices = oFi.getChoices(fl_nm);
          rows = [];
          for (ix = _j = 0, _ref5 = choices.options.length; 0 <= _ref5 ? _j < _ref5 : _j > _ref5; ix = 0 <= _ref5 ? ++_j : --_j) {
            s = choices.values[ix] === fl.value ? 'yes' : '';
            rows.push({
              option: choices.options[ix],
              value: choices.values[ix],
              selected: s
            });
          }
          fl.Choice = rows;
        }
        fl.issue = issues[fl_nm] ? issues[fl_nm].asTable()[0].issue : '';
        out.push(fl);
      }
      this.fist_table = {
        Form: [
          {
            show_req: show_req,
            any_req: any_req,
            help: help
          }
        ],
        Control: out
      };
      return this.viewExe.includePart(part, false);
    };

    TagExe.prototype.Tag_defer = function(oPt) {
      var code, name;
      name = 'anonymous';
      if ('name' in oPt.attrs) {
        name = this.viewExe.handleIt(oPt.attrs.name);
      }
      code = this.viewExe.doAllParts(oPt.parts);
      this.viewExe.pushDefer({
        name: name,
        code: code
      });
      return '';
    };

    TagExe.prototype.Tag_if_any = function(oPt) {
      return this.ifAnyAll(oPt, true);
    };

    TagExe.prototype.Tag_if_all = function(oPt) {
      return this.ifAnyAll(oPt, false);
    };

    TagExe.prototype.Tag_if = function(oPt) {
      return this.ifAnyAll(oPt, true);
    };

    TagExe.prototype.Tag_if_true = function(oPt) {
      return this.ifTrueFalse(oPt, true);
    };

    TagExe.prototype.Tag_if_false = function(oPt) {
      return this.ifTrueFalse(oPt, false);
    };

    TagExe.prototype.ifTrueFalse = function(oPt, is_if_true) {
      var f, found_true, nm, out;
      f = ':TagExe.ifTrueFalse';
      nm = this.viewExe.handleIt(oPt.attrs.name);
      this.Epic.log2(f, oPt.attrs.name, nm, this.info_if_nms[nm]);
      found_true = this.info_if_nms[nm] === is_if_true;
      return out = found_true ? this.viewExe.doAllParts(oPt.parts) : '';
    };

    TagExe.prototype.ifAnyAll = function(oPt, is_if_any) {
      var f, flip, found_nm, found_true, left, nm, op, out, right, use_op, val, _ref;
      f = ':TagExe.ifAnyAll';
      out = '';
      found_nm = false;
      _ref = oPt.attrs;
      for (nm in _ref) {
        val = _ref[nm];
        val = this.viewExe.handleIt(val);
        flip = false;
        switch (nm) {
          case 'right':
            right = val;
            continue;
          case 'left':
          case 'val':
          case 'value':
            left = val;
            continue;
          case 'name':
            found_nm = val;
            continue;
          case 'eq':
          case 'ne':
          case 'lt':
          case 'gt':
          case 'ge':
          case 'le':
          case 'op':
            if (nm !== 'op') {
              right = val;
              op = nm;
            } else {
              op = val;
            }
            use_op = op;
            if (op.substr(0, 1) === '!') {
              flip = true;
              use_op = op.substr(1);
            }
            switch (use_op) {
              case 'eq':
                found_true = left === right;
                break;
              case 'ne':
                found_true = left !== right;
                break;
              case 'gt':
                found_true = left > right;
                break;
              case 'ge':
                found_true = left >= right;
                break;
              case 'lt':
                found_true = left < right;
                break;
              case 'le':
                found_true = left <= right;
            }
            op = null;
            break;
          case 'not_empty':
          case 'empty':
            if (nm === 'not_empty') {
              flip = true;
            }
            found_true = val.length === 0;
            break;
          case 'in_list':
          case 'not_in_list':
            if (nm === 'not_in_list') {
              flip = true;
            }
            found_true = ((val.split(',')).indexOf(left)) !== -1;
            break;
          case 'table_has_no_values':
          case 'table_is_empty':
          case 'table_is_not_empty':
          case 'table_has_values':
            if (nm === 'table_has_no_values' || nm === 'table_is_empty') {
              flip = true;
            }
            found_true = this.Epic.getViewTable(val).length !== 0;
            break;
          case 'if_true':
          case 'if_false':
            if (nm === 'if_true') {
              flip = true;
            }
            found_true = this.info_if_nms[val] === false;
            break;
          case 'true':
          case 'false':
            if (nm === 'true') {
              flip = true;
            }
            found_true = val === false || val === 'false';
            break;
          case 'not_set':
          case 'set':
            if (nm === 'not_set') {
              flip = true;
            }
            found_true = val === true || (typeof val === 'number' && val) || (typeof val === 'string' && val.length > 0 && !val.match(/^(no|false|n|0)$/i)) ? true : false;
            break;
        }
        if (flip) {
          found_true = !found_true;
        }
        if (is_if_any && found_true) {
          break;
        }
        if (!is_if_any && !found_true) {
          break;
        }
      }
      if (found_nm !== false) {
        this.Epic.log2(f, found_nm, found_true, oPt.attrs);
        this.info_if_nms[found_nm] = found_true;
      }
      if (found_true) {
        out = this.viewExe.doAllParts(oPt.parts);
      }
      return out;
    };

    TagExe.prototype.Tag_comment = function(oPt) {
      return "\n<!--\n" + (this.viewExe.doAllParts(oPt.parts)) + "\n-->\n";
    };

    TagExe.prototype.Tag_foreach = function(oPt) {
      var at_table, break_rows_list, count, lh, limit, oMd, out, rh, rh_alias, row, tbl, _i, _len, _ref, _ref1;
      at_table = this.viewExe.handleIt(oPt.attrs.table);
      _ref = at_table.split('/'), lh = _ref[0], rh = _ref[1];
      if (lh in this.info_foreach) {
        tbl = this.info_foreach[lh].row[rh];
      } else {
        this.viewExe.haveTableRefrence(lh, rh);
        oMd = this.Epic.getInstance(lh);
        tbl = oMd.getTable(rh);
      }
      if (tbl.length === 0) {
        return '';
      }
      rh_alias = rh;
      if ('alias' in oPt.attrs) {
        rh_alias = this.viewExe.handleIt(oPt.attrs.alias);
      }
      this.info_foreach[rh_alias] = {};
      break_rows_list = this.calcBreak(tbl.length, oPt);
      out = '';
      limit = tbl.length;
      if ('limit' in oPt.attrs) {
        limit = Number(this.viewExe.handleIt(oPt.attrs.limit)) - 1;
      }
      for (count = _i = 0, _len = tbl.length; _i < _len; count = ++_i) {
        row = tbl[count];
        if (count > limit) {
          break;
        }
        this.info_foreach[rh_alias].row = $.extend(true, {}, row, {
          _FIRST: count === 0,
          _LAST: count === tbl.length - 1,
          _SIZE: tbl.length,
          _COUNT: count,
          _BREAK: (_ref1 = count + 1, __indexOf.call(break_rows_list, _ref1) >= 0)
        });
        out += this.viewExe.doAllParts(oPt.parts);
      }
      delete this.info_foreach[rh_alias];
      return out;
    };

    TagExe.prototype.calcBreak = function(sZ, oPt) {
      var break_fixed, break_rows_list, check_for_breaks, check_row, column_count, extra_rows, last_check_row, nm, p, repeat_value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      p = oPt.attrs;
      break_rows_list = [];
      _ref = ['break_min', 'break_fixed', 'break_at', 'break_even'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        nm = _ref[_i];
        p[nm] = p[nm] != null ? this.viewExe.handleIt(p[nm]) : 0;
      }
      check_for_breaks = p.break_min && sZ < p.break_min ? 0 : 1;
      if (check_for_breaks && p.break_fixed) {
        check_row = p.break_fixed;
        while (sZ > check_row) {
          break_rows_list.push(check_row + 1);
          check_row += p.break_fixed;
        }
        check_for_breaks = 0;
      }
      if (check_for_breaks && p.break_at) {
        repeat_value = 0;
        last_check_row = 0;
        _ref1 = p.break_at.split(',');
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          check_row = _ref1[_j];
          if (!check_row.length) {
            if (last_check_row <= 0 || repeat_value <= 0) {
              break;
            }
            check_row = last_check_row + repeat_value;
            while (sZ > check_row) {
              break_rows_list.push(check_row + 1);
              check_row += repeat_value;
            }
            break;
          } else {
            if (check_row <= 0) {
              break;
            }
            if (sZ > check_row) {
              break_rows_list.push(check_row + 1);
            } else {
              break;
            }
          }
          repeat_value = check_row - last_check_row;
          last_check_row = check_row;
        }
        check_for_breaks = 0;
      }
      if (check_for_breaks && p.break_even) {
        column_count = 1;
        repeat_value = 0;
        last_check_row = 0;
        _ref2 = p.break_even.split(',');
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          check_row = _ref2[_k];
          if (!check_row.length) {
            if (last_check_row <= 0 || repeat_value <= 0) {
              break;
            }
            check_row = last_check_row + repeat_value;
            while (sZ >= check_row) {
              column_count++;
              check_row += repeat_value;
            }
            break;
          } else {
            if (check_row <= 0) {
              break;
            }
            if (sZ >= check_row) {
              column_count++;
            } else {
              break;
            }
          }
          repeat_value = check_row - last_check_row;
          last_check_row = check_row;
        }
        if (column_count > 1) {
          break_fixed = Math.floor(sZ / column_count);
          extra_rows = sZ - break_fixed * column_count;
          check_row = break_fixed;
          while (sZ > check_row) {
            if (extra_rows) {
              check_row++;
              extra_rows--;
            }
            break_rows_list.push(check_row + 1);
            check_row += break_fixed;
          }
        }
        check_for_breaks = 0;
      }
      return break_rows_list;
    };

    TagExe.prototype.Tag_dyno_form = function(oPt) {
      var ctr, fl, fl_nm, fm_nm, help_html, hpfl, in_ct, oFi, otr, out, req, sh_req, _base, _base1, _i, _len, _ref, _ref1, _ref2;
      if ((_ref = (_base = oPt.attrs).help) == null) {
        _base.help = '';
      }
      if ((_ref1 = (_base1 = oPt.attrs).show_required) == null) {
        _base1.show_required = 1;
      }
      fm_nm = this.viewExe.handleIt(oPt.attrs.form);
      oFi = this.loadFistDef(fm_nm);
      sh_req = false;
      out = [];
      hpfl = oFi.getHtmlPostedFieldsList(fm_nm);
      for (_i = 0, _len = hpfl.length; _i < _len; _i++) {
        fl_nm = hpfl[_i];
        fl = oFi.getFieldAttributes(fl_nm);
        req = '';
        if (oPt.attrs.show_required === '1' && fl.required === '1') {
          req = '<font color="red" size="-2">*</font>';
          sh_req = true;
        }
        help_html = '';
        if (oPt.attrs.help === 'inline' && fl.help_text.length) {
          help_html = "<br><font size=\"-2\">{" + fl.help_text + "}</font>";
        }
        in_ct = this.viewExe.run([
          '', [4], 'control', {
            form: fm_nm,
            field: fl_nm
          }, '', [1]
        ]);
        out.push("<label for=\"" + fl_nm + "\" class=\"ui-input-text\">\n" + req + (fl.label || fl_nm) + "</label>\n" + in_ct + help_html);
      }
      if (sh_req) {
        out.push('<div><font color="red" size="-1">* required</font></div>');
      }
      _ref2 = ['', '\n'], otr = _ref2[0], ctr = _ref2[1];
      return otr + out.join(ctr + otr) + ctr;
    };

    TagExe.prototype.Tag_form = function(oPt) {
      var add, attr, fist_nm, o, out_attrs, saw_method, val, _i, _len, _ref, _ref1;
      saw_method = false;
      out_attrs = [];
      _ref = oPt.attrs;
      for (attr in _ref) {
        val = _ref[attr];
        val = this.viewExe.handleIt(val);
        add = false;
        switch (attr) {
          case 'forms_used':
            this.forms_included = val.split(',');
            break;
          case 'method':
            saw_method = true;
            break;
          case 'show_required':
          case 'help':
            break;
          default:
            add = true;
        }
        if (add) {
          out_attrs.push("" + attr + "=\"" + val + "\"");
        }
      }
      if (!saw_method) {
        out_attrs.push('METHOD="POST"');
      }
      _ref1 = this.forms_included;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        fist_nm = _ref1[_i];
        this.loadFistDef(fist_nm);
      }
      if (!this.forms_included.length) {
        this.forms_included = ['A FORM TAG WITH NO NAME?'];
      }
      o = "<form " + (out_attrs.join(' ')) + ">\n";
      try {
        o += this.viewExe.doAllParts(oPt.parts);
      } finally {
        this.forms_included = this.fist_objects = [];
      }
      return o += '</form>';
    };

    TagExe.prototype.Tag_control = function(oPt) {
      var control_html, fl_def, fl_nm, fm_nm, oFi, one, value;
      fl_nm = oPt.attrs.field;
      fm_nm = this.viewExe.handleIt(oPt.attrs.form);
      oFi = this.loadFistDef(fm_nm);
      fl_def = oFi.getFieldAttributes(fl_nm);
      value = oFi.getHtmlFieldValue(fl_nm);
      one = fl_def.type.substr(0, 5 === 'radio') ? oPt.attrs.value : null;
      control_html = this.Epic.renderer.doControl(oFi, fl_nm, value, fl_def.type, fl_def.cdata, fl_def.width, fl_def.max_length, one);
      return control_html;
    };

    TagExe.prototype.Tag_form_action = function(oPt) {
      var action, attr, click_index, link, o, out_attrs, val, value, _base, _base1, _ref, _ref1, _ref2;
      link = {};
      if (oPt.attrs.src != null) {
        if ((_ref = (_base = oPt.attrs).type) == null) {
          _base.type = 'image';
        }
        if ((_ref1 = (_base1 = oPt.attrs).border) == null) {
          _base1.border = '0';
        }
      }
      out_attrs = [];
      action = '';
      value = '';
      _ref2 = oPt.attrs;
      for (attr in _ref2) {
        if (!__hasProp.call(_ref2, attr)) continue;
        val = _ref2[attr];
        switch (attr) {
          case 'action':
            action = (this.viewExe.handleIt(val)).trim();
            break;
          case 'value':
            value = (this.viewExe.handleIt(val)).trim();
            break;
          default:
            if (attr.match(/^p_/)) {
              link[attr.substr(2)] = this.viewExe.handleIt(val);
            } else {
              out_attrs.push("" + attr + "=\"" + (window.EpicMvc.escape_html(this.viewExe.handleIt(val))) + "\"");
            }
        }
      }
      out_attrs.push('title=' + action);
      link._b = action;
      click_index = this.Epic.request().addLink(link);
      return o = this.Epic.renderer.form_action(out_attrs, click_index, action, value);
    };

    TagExe.prototype.Tag_link_action = function(oPt) {
      var action, attr, attr_text, click_index, id, k, link, o, plain_attr, text, v, val, _ref;
      link = {};
      action = this.viewExe.handleIt(oPt.attrs.action);
      link._a = action;
      plain_attr = {
        title: action
      };
      _ref = oPt.attrs;
      for (attr in _ref) {
        if (!__hasProp.call(_ref, attr)) continue;
        val = _ref[attr];
        if ((attr.substr(0, 2)) === 'p:') {
          link[attr.substr(2)] = this.viewExe.handleIt(val);
        } else {
          switch (attr) {
            case 'href':
            case 'title':
            case 'onclick':
            case 'action':
              break;
            default:
              plain_attr[attr] = this.viewExe.handleIt(val);
          }
        }
      }
      text = '';
      text += this.viewExe.doAllParts(oPt.parts);
      id = '';
      attr_text = '';
      for (k in plain_attr) {
        if (!__hasProp.call(plain_attr, k)) continue;
        v = plain_attr[k];
        attr_text += " " + k + "=\"" + (window.EpicMvc.escape_html(v)) + "\"";
      }
      click_index = this.Epic.request().addLink(link);
      return o = this.Epic.renderer.link_action(click_index, id, attr_text, text);
    };

    return TagExe;

  })();

  window.EpicMvc.Model.TagExe$Base = TagExe;

}).call(this);
