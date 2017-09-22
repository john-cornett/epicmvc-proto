// Generated by CoffeeScript 1.9.2
(function() {
  'use strict';
  var Fist,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Fist = (function(superClass) {
    extend(Fist, superClass);

    function Fist(view_nm, options) {
      this.fist = {};
      Fist.__super__.constructor.call(this, view_nm, options);
    }

    Fist.prototype.eventLogout = function() {
      return true;
    };

    Fist.prototype.event = function(name, act, fistNm, fieldNm, p) {
      var f, field, fist, had_issue, invalidate, invalidate2, tmp_val, was_issue, was_val;
      f = 'event:' + act + '-' + fistNm + '/' + fieldNm;
      _log2(f, p);
      if (name !== 'Fist') {
        BLOWUP();
      }
      fist = this._getFist(fistNm, p.row, true);
      if (fist === false) {
        return;
      }
      if (fieldNm) {
        field = fist.ht[fieldNm];
      }
      switch (act) {
        case 'keyup':
        case 'change':
          if (field.type === 'yesno') {
            if (p.val === false) {
              p.val = field.cdata[1];
            } else {
              p.val = field.cdata[0];
            }
          }
          if (field.hval !== p.val) {
            had_issue = field.issue;
            field.hval = p.val;
            tmp_val = E.fistH2H(field, field.hval);
            E.fistVAL(field, tmp_val);
            if (act === 'change' || had_issue !== field.issue) {
              invalidate = true;
            }
          }
          break;
        case 'blur':
          was_val = field.hval;
          was_issue = field.issue;
          field.hval = E.fistH2H(field, field.hval);
          E.fistVAL(field, field.hval);
          _log2(f, 'invalidate?', was_val, field.hval, was_issue, field.issue);
          if (was_val !== field.hval || was_issue !== field.issue) {
            invalidate = true;
          }
          break;
        case 'focus':
          if (fist.fnm !== fieldNm) {
            fist.fnm = fieldNm;
          }
          break;
        default:
          return Fist.__super__.event.call(this, name, act, fistNm, fieldNm, p);
      }
      invalidate2 = this.confirm(fist, field, act);
      if (invalidate || invalidate2) {
        if (p.async !== true) {
          this.invalidateTables([fist.rnm]);
        } else {
          delete this.Table[fist.rnm];
        }
      }
    };

    Fist.prototype.confirm = function(fist, field, act) {
      var check, src, tar, tval, val, was_issue, was_val;
      if (!((field.confirm != null) || (field.confirm_src != null))) {
        return false;
      }
      tar = field.confirm_src != null ? field : fist.ht[field.confirm];
      src = fist.ht[tar.confirm_src];
      if (tar.issue != null) {
        if (src.issue != null) {
          delete src.issue;
          return true;
        }
        return false;
      }
      was_val = src.hval;
      if (was_val === '' && src.fieldNm !== field.fieldNm) {
        return false;
      }
      was_issue = src.issue;
      val = E.fistH2H(tar, was_val);
      tval = E.fistH2H(tar, tar.hval);
      if (val === tval) {
        delete src.issue;
      } else {
        check = 'FIELD_ISSUE' + (src.issue_text ? '_TEXT' : '');
        this._makeIssue(check, src);
      }
      return was_issue !== src.issue;
    };

    Fist.prototype._makeIssue = function(check, field) {
      var ref, token;
      token = check;
      if ('A' !== E.type_oau(token)) {
        token = [token, field.nm, (ref = field.label) != null ? ref : field.nm, field.issue_text];
      }
      field.issue = new E.Issue(field.fistNm, field.nm);
      return field.issue.add(token[0], token.slice(1));
    };

    Fist.prototype.fistClear = function(fistNm, row) {
      var rnm;
      rnm = fistNm + (row ? ':' + row : '');
      if (rnm in this.fist) {
        delete this.fist[rnm];
        return this.invalidateTables([rnm]);
      }
    };

    Fist.prototype.fistValidate = function(ctx, fistNm, row) {
      var ans, errors, f, field, fieldNm, fist, hval, invalidate, nm, r, ref, ref1, ref2;
      f = 'fistValidate:' + fistNm + (row != null ? ':' + row : '');
      _log2(f);
      r = ctx;
      fist = this._getFist(fistNm, row);
      errors = 0;
      ref = fist.ht;
      for (fieldNm in ref) {
        field = ref[fieldNm];
        hval = E.fistH2H(field, field.hval);
        if (hval !== field.hval) {
          field.hval = hval;
          invalidate = true;
        }
        if (true !== E.fistVAL(field, field.hval)) {
          errors++;
        }
      }
      ref1 = fist.ht;
      for (fieldNm in ref1) {
        field = ref1[fieldNm];
        if (field.confirm != null) {
          if (true === this.confirm(fist, field, 'fistValidate')) {
            errors++;
          }
        }
      }
      if (errors) {
        invalidate = true;
        r.fist$success = 'FAIL';
        r.fist$errors = errors;
      } else {
        r.fist$success = 'SUCCESS';
        ans = r[fist.nm] = {};
        ref2 = fist.db;
        for (nm in ref2) {
          field = ref2[nm];
          ans[nm] = E.fistH2D(field, field.hval);
        }
      }
      _log2(f, 'result', r, ans);
      if (invalidate === true) {
        this.invalidateTables([fist.rnm]);
      }
    };

    Fist.prototype.loadTable = function(tbl_nm) {
      var Control, Field, any_req, baseFistNm, field, fieldNm, fist, i, ix, len, ref, ref1, row;
      ref = tbl_nm.split(':'), baseFistNm = ref[0], row = ref[1];
      fist = this._getFist(baseFistNm, row);
      Field = {};
      Control = [];
      any_req = false;
      ref1 = fist.sp.FIELDS;
      for (ix = i = 0, len = ref1.length; i < len; ix = ++i) {
        fieldNm = ref1[ix];
        field = fist.ht[fieldNm];
        row = this._makeField(fist, field, ix, row);
        if (row.req) {
          any_req = true;
        }
        Field[fieldNm] = [row];
        Control.push(row);
      }
      return this.Table[tbl_nm] = [
        {
          Field: [Field],
          Control: Control,
          any_req: any_req
        }
      ];
    };

    Fist.prototype._makeField = function(fist, field, ix, row) {
      var choice_type, choices, defaults, f, fl, i, ref, ref1, rows, s;
      f = '_makeField';
      defaults = {
        is_first: ix === 0,
        focus: fist.fnm === field.nm,
        yes_val: 'X',
        req: false,
        "default": '',
        width: '',
        size: '',
        issue: '',
        value: '',
        selected: false,
        name: field.nm
      };
      fl = E.merge(defaults, field);
      ref = fl.type.split(':'), fl.type = ref[0], choice_type = ref[1];
      fl.id = 'U' + E.nextCounter();
      fl.value = field.hval;
      if (fl.type === 'yesno') {
        if (fl.cdata == null) {
          fl.cdata = ['1', '0'];
        }
        fl.yes_val = String(fl.cdata[0]);
        if (fl.value === fl.yes_val) {
          fl.selected = true;
        } else {
          fl.value = fl.cdata[1];
        }
      }
      if (field.issue) {
        fl.issue = field.issue.asTable()[0].issue;
      }
      if (fl.type === 'radio' || fl.type === 'pulldown') {
        choices = this._getChoices(choice_type, fist, field, row);
        rows = [];
        s = '';
        for (ix = i = 0, ref1 = choices.options.length; 0 <= ref1 ? i < ref1 : i > ref1; ix = 0 <= ref1 ? ++i : --i) {
          s = choices.values[ix] === (String(fl.value));
          rows.push({
            option: choices.options[ix],
            value: choices.values[ix],
            selected: s
          });
          fl.Choice = rows;
        }
      }
      return fl;
    };

    Fist.prototype._getFist = function(p_fist, p_row, from_event) {
      var db_value_hash, f, field, fieldNm, fist, i, len, nm, rec, ref, ref1, ref2, ref3, rnm;
      f = '_getFist:' + p_fist + (p_row != null ? ':' + p_row : '');
      rnm = p_fist + (p_row ? ':' + p_row : '');
      if (!(rnm in this.fist)) {
        if (from_event === true) {
          return false;
        }
        fist = {
          rnm: rnm,
          nm: p_fist,
          row: p_row,
          ht: {},
          db: {},
          st: 'new',
          sp: E.fistDef[p_fist]
        };
        _log2(f, 'new fist', fist);
        E.option.fi1(fist);
        ref = fist.sp.FIELDS;
        for (i = 0, len = ref.length; i < len; i++) {
          fieldNm = ref[i];
          field = E.merge({}, E.fieldDef[fieldNm], {
            nm: fieldNm,
            fistNm: p_fist,
            row: p_row
          });
          field.h2h = (function() {
            switch (E.type_oau(field.h2h)) {
              case 'S':
                return field.h2h.split(/[:,]/);
              case 'A':
                return field.h2h;
              default:
                return [];
            }
          })();
          E.option.fi2(field, fist);
          fist.ht[fieldNm] = fist.db[field.db_nm] = field;
        }
        ref1 = fist.ht;
        for (fieldNm in ref1) {
          rec = ref1[fieldNm];
          if (rec.confirm != null) {
            fist.ht[rec.confirm].confirm_src = fieldNm;
          }
        }
        this.fist[rnm] = fist;
      } else {
        fist = this.fist[rnm];
      }
      if (fist.st === 'new') {
        db_value_hash = (ref2 = E[E.appFist(p_fist)]().fistGetValues(p_fist, p_row)) != null ? ref2 : {};
        ref3 = fist.db;
        for (nm in ref3) {
          field = ref3[nm];
          field.hval = E.fistD2H(field, db_value_hash[nm]);
        }
        fist.st = 'loaded';
      }
      return fist;
    };

    Fist.prototype._getChoices = function(type, fist, field) {
      var i, j, len, len1, opt_col, options, rec, ref, ref1, ref2, row, val_col, values, wistNm;
      options = [];
      values = [];
      switch (type) {
        case 'array':
          ref = field.cdata;
          for (i = 0, len = ref.length; i < len; i++) {
            rec = ref[i];
            if (typeof rec === 'object') {
              options.push(String(rec[1]));
              values.push(String(rec[0]));
            } else {
              options.push(String(rec));
              values.push(String(rec));
            }
          }
          return {
            options: options,
            values: values
          };
        case 'wist':
          ref1 = field.cdata.split(':'), wistNm = ref1[0], val_col = ref1[1], opt_col = ref1[2];
          ref2 = E.Wist(wistNm);
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            row = ref2[j];
            options.push(row[opt_col]);
            values.push(row[val_col]);
          }
          return {
            options: options,
            values: values
          };
        case 'custom':
          return E[E.appFist(fist.nm)]().fistGetChoices(fist.nm, field.nm, fist.row);
        default:
          return E.option.fi4(type, fist, field);
      }
    };

    return Fist;

  })(E.ModelJS);

  E.fistH2H = function(field, val) {
    var i, len, ref, str;
    val = E.fistH2H$pre(field, val);
    ref = field.h2h;
    for (i = 0, len = ref.length; i < len; i++) {
      str = ref[i];
      val = E['fistH2H$' + str](field, val);
    }
    return val;
  };

  E.fistH2H$pre = function(field, val) {
    return val;
  };

  E.fistH2D = function(field, val) {
    if (field.h2d) {
      return E['fistH2D$' + field.h2d](field, val);
    } else {
      return val;
    }
  };

  E.fistD2H = function(field, val) {
    var ref;
    if (field.d2h) {
      return E['fistD2H$' + field.d2h](field, val);
    } else {
      return (ref = val != null ? val : field["default"]) != null ? ref : '';
    }
  };

  E.fistVAL = function(field, val) {
    var check, ref, ref1, ref2, token;
    delete field.issue;
    check = true;
    E.option.fi3(field, val);
    if (val.length === 0) {
      if (field.req === true) {
        check = field.req_text ? ['FIELD_EMPTY_TEXT', field.nm, (ref = field.label) != null ? ref : field.nm, field.req_text] : ['FIELD_EMPTY', field.nm, (ref1 = field.label) != null ? ref1 : field.nm];
      }
    } else {
      if (field.validate) {
        check = E['fistVAL$' + field.validate](field, val);
        if (check === false) {
          check = 'FIELD_ISSUE' + (field.issue_text ? '_TEXT' : '');
        }
      }
    }
    if (check !== true) {
      token = check;
      if ('A' !== E.type_oau(token)) {
        token = [token, field.nm, (ref2 = field.label) != null ? ref2 : field.nm, field.issue_text];
      }
      field.issue = new E.Issue(field.fistNm, field.nm);
      field.issue.add(token[0], token.slice(1));
    }
    return check === true;
  };

  E.fistVAL$test = function(field, val) {
    var re;
    re = field.validate_expr;
    if (typeof re === 'string') {
      re = new RegExp(re);
    }
    return re.test(val);
  };

  E.Model.Fist$Base = Fist;

}).call(this);
