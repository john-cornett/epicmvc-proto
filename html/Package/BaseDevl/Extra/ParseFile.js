// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var FindAttrVal, FindAttrs, ParseFile, camelCase, doError, findStyleVal, findStyles, findVars, mkNm, mkObj, nm_map, sq,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  camelCase = function(input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  };

  mkNm = function(nm) {
    if (nm.match(/^[a-zA-Z_]$/)) {
      return nm;
    } else {
      return sq(nm);
    }
  };

  mkObj = function(obj) {
    var nm, val;
    return '{' + ((function() {
      var _results;
      _results = [];
      for (nm in obj) {
        val = obj[nm];
        _results.push((mkNm(nm)) + ':' + val);
      }
      return _results;
    })()).join() + '}';
  };

  sq = function(text) {
    return "'" + (text.replace(/'/gm, '\\\'')).replace(/\n/g, '\\n') + "'";
  };

  findStyleVal = function(i, a) {
    var nm, p, parts, s, start, str, top;
    s = 'findStyleVal:';
    top = i;
    start = i;
    while (i < a.length) {
      if ((p = a[i++].trim()) !== '') {
        break;
      }
    }
    if (p === '') {
      return [false];
    }
    if (!(i < a.length)) {
      return [s + 'name', start, i];
    }
    nm = camelCase(p);
    start = i;
    while (i < a.length) {
      if ((p = a[i++].trim()) !== '') {
        break;
      }
    }
    if (!(i < a.length && p === ':')) {
      return [s + 'colon', start, i, nm];
    }
    start = i;
    parts = [];
    while (i < a.length) {
      if ((p = a[i++]) === ';') {
        break;
      }
      parts.push(p);
    }
    if (!(p === ';' || i >= a.length)) {
      return [s + 'semi-colon', start, i, nm];
    }
    str = (parts.join('')).trim();
    return [true, top, i, nm, str];
  };

  findStyles = function(file_info, parts) {
    var good, i, nm, start, str, styles, _ref;
    styles = {};
    i = 0;
    while (i < parts.length) {
      _ref = findStyleVal(i, parts), good = _ref[0], start = _ref[1], i = _ref[2], nm = _ref[3], str = _ref[4];
      if (good === false) {
        break;
      }
      if (good !== true) {
        _log2('STYLE-ERROR - parse:', {
          file_info: file_info,
          parts: parts,
          good: good,
          start: start,
          i: i,
          nm: nm,
          str: str
        });
        continue;
      }
      styles[nm] = (findVars(str)).join('+');
    }
    return styles;
  };

  nm_map = {
    'class': 'className',
    'for': 'htmlFor',
    defaultvalue: 'defaultValue',
    defaultchecked: 'defaultChecked',
    colspan: 'colSpan',
    cellpadding: 'cellPadding',
    cellspacing: 'cellSpacing',
    maxlength: 'maxLength',
    tabindex: 'tabIndex'
  };

  FindAttrVal = function(i, a) {
    var nm, p, parts, quo, start, top, _ref;
    top = start = i;
    while (i < a.length) {
      if ((p = a[i++].trim()) !== '') {
        break;
      }
    }
    if (!(i < a.length)) {
      return [false];
    }
    if (p === '') {
      return ['attr-name', start, i];
    }
    p.toLowerCase();
    nm = (_ref = nm_map[p]) != null ? _ref : p;
    start = i;
    while (i < a.length) {
      if ((p = a[i++].trim()) !== '') {
        break;
      }
    }
    if (p !== '=') {
      if (nm === 'selected' || nm === 'autofocus') {
        return [true, start, i - 1, nm, '=', '"', ['false']];
      }
      return ['equals', start, i, nm];
    }
    start = i;
    while (i < a.length) {
      if ((p = a[i++].trim()) !== '') {
        break;
      }
    }
    if (!(p === '"' || p === "'")) {
      return ['open-quote', start, i, nm, '='];
    }
    quo = p;
    start = i;
    parts = [];
    while (i < a.length) {
      if ((p = a[i++]) === quo) {
        break;
      }
      parts.push(p);
    }
    if (p !== quo) {
      return ['close-quote', start, i, nm, '=', quo];
    }
    return [true, top, i, nm, '=', quo, parts];
  };

  FindAttrs = function(file_info, str) {
    var attr_obj, attr_split, attrs_need_cleaning, data_nm, debug, empty, eq, f, good, i, nm, parts, quo, start, style_obj, _i, _len, _ref, _ref1, _ref2, _ref3;
    f = ':parse.FindAttrs:';
    str = str.replace(/\se-/gm, 'data-e-');
    attr_split = str.trim().split(/([\s="':;])/);
    empty = attr_split[attr_split.length - 1] === '/' ? '/' : '';
    attrs_need_cleaning = false;
    if (empty === '/') {
      attr_split.pop();
    }
    attr_obj = {};
    i = 0;
    debug = false;
    while (i < attr_split.length) {
      _ref = FindAttrVal(i, attr_split), good = _ref[0], start = _ref[1], i = _ref[2], nm = _ref[3], eq = _ref[4], quo = _ref[5], parts = _ref[6];
      if (good === false) {
        break;
      }
      if (good !== true) {
        _log2('ERROR - parse:', {
          file_info: file_info,
          good: good,
          start: start,
          i: i,
          nm: nm,
          eq: eq,
          quo: quo,
          parts: parts,
          str: str
        });
        continue;
      }
      if (nm === 'data-e-click' || nm === 'data-e-change' || nm === 'data-e-dblclick') {
        debug = true;
        if ((_ref1 = attr_obj['data-e-action']) == null) {
          attr_obj['data-e-action'] = [];
        }
        attr_obj['data-e-action'].push((nm.slice(7)) + ':' + parts.join(''));
        continue;
      }
      if (nm === 'data-e-action') {
        debug = true;
        if ((_ref2 = attr_obj['data-e-action']) == null) {
          attr_obj['data-e-action'] = [];
        }
        attr_obj[nm].push(parts.join(''));
      }
      if (nm === 'style') {
        style_obj = findStyles(file_info, parts);
        attr_obj[nm] = mkObj(style_obj);
        continue;
      }
      if (nm[0] === '?') {
        attrs_need_cleaning = true;
      }
      attr_obj[nm] = (findVars(parts.join(''))).join('+');
    }
    _ref3 = ['data-e-action'];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      data_nm = _ref3[_i];
      if (attr_obj[data_nm]) {
        attr_obj[data_nm] = (findVars(attr_obj[data_nm].join())).join('+');
      }
    }
    if (debug) {
      _log2(f, 'bottom', str, attr_obj);
    }
    return [mkObj(attr_obj), empty, attrs_need_cleaning];
  };

  findVars = function(text) {
    var ans, args, custom_hash_part, hash_part, i, last, parts, results, _ref;
    parts = text.split(/&([a-zA-Z0-9_]+\/[^;]{1,60});?/gm);
    results = [];
    if (parts.length === 1) {
      return [sq(parts[0])];
    }
    i = 0;
    while (i < parts.length - 1) {
      if (parts[i].length) {
        results.push(sq(parts[i]));
      }
      args = parts[i + 1].split('/');
      last = args.length - 1;
      if (last !== 1 && last !== 2) {
        _log2('ERROR VarGet:', parts[i + 1]);
        continue;
      }
      _ref = args[last].split('#'), args[last] = _ref[0], hash_part = _ref[1], custom_hash_part = _ref[2];
      ans = last === 1 ? "oE.v2(" + (sq(args[0])) + "," + (sq(args[1])) : "oE.v3(" + (sq(args[0])) + "," + (sq(args[1])) + "," + (sq(args[2]));
      if (hash_part) {
        ans += "," + (sq(hash_part));
      } else {
        if (custom_hash_part) {
          ans += ",''," + (sq(custom_hash_part));
        }
      }
      ans += ')';
      results.push(ans);
      i += 2;
    }
    if (parts[parts.length - 1]) {
      results.push(sq(parts[parts.length - 1]));
    }
    return results;
  };

  doError = function(file_stats, text) {
    console.log('ERROR', file_stats, text);
    throw Error(text);
  };

  ParseFile = function(file_stats, file_contents) {
    var T_EPIC, T_M1, T_M2, T_STYLE, T_TEXT, after, after_comment, after_script, attr_clean, attrs, base_nm, children, content, counter, doChildren, dom_close, dom_entity_map, dom_nms, empty, etags, f, flavor, i, nextCounter, oi, parts, prev_children, stats, t, tag_names_for_debugger, tag_wait, text, whole_tag, _ref, _ref1;
    f = ':BaseDevl.E/ParseFile.ParseFile~' + file_stats;
    counter = 0;
    nextCounter = function() {
      return ++counter;
    };
    etags = ['page', 'part', 'if', 'foreach', 'defer'];
    T_EPIC = 0;
    T_M1 = 1;
    T_M2 = 2;
    T_STYLE = 3;
    T_TEXT = 4;
    stats = {
      text: 0,
      dom: 0,
      epic: 0,
      defer: 0
    };
    dom_nms = ['style', 'div', 'a', 'span', 'ol', 'ul', 'li', 'p', 'b', 'i', 'dl', 'dd', 'dt', 'form', 'fieldset', 'label', 'legend', 'button', 'input', 'textarea', 'select', 'option', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'img', 'br', 'hr', 'header', 'footer', 'section'];
    dom_close = ['img', 'br', 'input', 'hr'];
    dom_entity_map = {
      nbsp: '\u00A0',
      reg: '\u00AE',
      copy: '\u00A9',
      times: '\u22A0',
      lt: '\u003C',
      gt: '\u003E',
      amp: '\u0026',
      quot: '\u0022'
    };
    after_comment = file_contents.replace(/-->/gm, '\x02').replace(/<!--[^\x02]*\x02/gm, function(m) {
      return m.replace(/[^\n]+/gm, '');
    });
    after_script = after_comment.replace(/<\/script>/gm, '\x02').replace(/<script[^\x02]*\x02/gm, '');
    after = after_script;
    parts = after.split(/<(\/?)([:a-z_0-9-]+)([^>]*)>/);
    i = 0;
    tag_wait = [];
    children = [];
    while (i < parts.length - 1) {
      if (tag_wait.length && tag_wait[tag_wait.length - 1][1] === 'defer') {
        children.push([T_TEXT, (findVars(parts[i])).join('+')]);
      } else {
        text = parts[i].replace(/^\s+|\s+$/gm, ' ');
        if (text.length && text !== ' ' && text !== '  ') {
          text = text.replace(/&([a-z]+);/gm, function(m, p1) {
            if (p1 in dom_entity_map) {
              return dom_entity_map[p1];
            } else {
              return '&' + p1 + 'BROKEN;';
            }
          });
          if (tag_wait.length) {
            children.push([T_TEXT, (findVars(text)).join('+')]);
          } else {
            children.push([T_M1, 'span', {}, (findVars(text)).join('+')]);
          }
          if (!tag_wait.length) {
            stats.text++;
          }
        }
      }
      if (parts[i + 1] === '/') {
        if (!tag_wait.length) {
          doError(file_stats, "Close tag found when none expected close=" + parts[i + 2]);
        }
        _ref = tag_wait.pop(), oi = _ref[0], base_nm = _ref[1], attrs = _ref[2], prev_children = _ref[3], flavor = _ref[4];
        if (base_nm === 'defer') {
          stats.defer++;
        }
        if (parts[i + 2] !== parts[oi + 2]) {
          tag_names_for_debugger = {
            open: parts[oi + 2],
            close: parts[i + 2]
          };
          doError(file_stats, "Mismatched tags open=" + parts[oi + 2] + ", close=" + parts[i + 2]);
        }
        if (children.length === 0) {
          whole_tag = [flavor, base_nm, attrs, []];
        } else if (flavor === T_EPIC) {
          whole_tag = [flavor, base_nm, attrs, children];
          if (!tag_wait.length) {
            stats.epic++;
          }
        } else if (base_nm === 'style') {
          flavor = T_STYLE;
          whole_tag = [flavor, base_nm, attrs, children];
        } else {
          whole_tag = [flavor, base_nm, attrs, children];
          if (!tag_wait.length) {
            stats.dom++;
          }
        }
        children = prev_children;
        children.push(whole_tag);
      } else {
        empty = '';
        attrs = '{}';
        attr_clean = false;
        flavor = 'e-' === parts[i + 2].slice(0, 2) ? T_EPIC : T_M1;
        if (parts[i + 3].length > 0) {
          _ref1 = FindAttrs(file_stats, parts[i + 3]), attrs = _ref1[0], empty = _ref1[1], attr_clean = _ref1[2];
        }
        if (flavor === T_EPIC) {
          base_nm = parts[i + 2].slice(2);
          if (base_nm === 'page' || base_nm === 'part') {
            empty = '/';
          }
          if (__indexOf.call(etags, base_nm) < 0) {
            doError(file_stats, "UNKNONW EPIC TAG (" + base_nm + ") : Expected one of " + (etags.join()));
          }
        } else {
          base_nm = parts[i + 2];
          if (base_nm === 'img' || base_nm === 'br' || base_nm === 'input' || base_nm === 'hr') {
            empty = '/';
          }
          if (__indexOf.call(dom_nms, base_nm) < 0) {
            doError(file_stats, 'Unknown tag name ' + base_nm + ' in ' + file_stats);
          }
          if (attr_clean) {
            flavor = T_M2;
          }
        }
        if (empty === '/') {
          if (base_nm === 'defer') {
            stats.defer++;
          }
          whole_tag = [flavor, base_nm, attrs, []];
          children.push(whole_tag);
          if (!tag_wait.length) {
            if (flavor === T_EPIC) {
              stats.epic++;
            } else {
              stats.dom++;
            }
          }
        } else {
          tag_wait.push([i, base_nm, attrs, children, flavor]);
          children = [];
        }
      }
      i += 4;
    }
    if (tag_wait.length) {
      doError(file_stats, "Missing closing tags" + (((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = tag_wait.length; _i < _len; _i++) {
          t = tag_wait[_i][0];
          _results.push(parts[t + 2]);
        }
        return _results;
      })()).join(', ')));
    }
    text = parts[i].replace(/^\s+|\s+$/g, ' ');
    if (text.length && text !== ' ' && text !== '  ') {
      text = text.replace(/&([a-z]+);/gm, function(m, p1) {
        if (p1 in dom_entity_map) {
          return dom_entity_map[p1];
        } else {
          return '&' + p1 + 'BROKEN;';
        }
      });
      children.push([T_M1, 'span', {}, (findVars(text)).join('+')]);
      stats.text++;
    }
    doChildren = function(child_array, fwrap) {
      var attr, has_epic, ix, kids, out, stuff, tag, _i, _len, _ref2;
      if ('A' !== E.type_oau(child_array)) {
        GLOBWUP();
      }
      out = [];
      has_epic = false;
      for (ix = _i = 0, _len = child_array.length; _i < _len; ix = ++_i) {
        _ref2 = child_array[ix], flavor = _ref2[0], tag = _ref2[1], attr = _ref2[2], kids = _ref2[3];
        switch (flavor) {
          case T_EPIC:
            has_epic = true;
            out.push("['" + tag + "'," + attr + "," + (doChildren(kids, true)) + "]");
            break;
          case T_M1:
            out.push("{tag:'" + tag + "',attrs:" + attr + ",children:" + (doChildren(kids)) + "}");
            break;
          case T_M2:
            out.push("{tag:'" + tag + "',attrs:oE.weed(" + attr + "),children:" + (doChildren(kids)) + "}");
            break;
          case T_STYLE:
            if (kids.length !== 1) {
              GLOWUP();
            }
            if (kids[0][0] !== T_TEXT) {
              BLOWUP();
            }
            out.push("{tag:'" + tag + "',attrs:" + attr + ",children:m.trust(" + kids[0][1] + ")}");
            break;
          case T_TEXT:
            out.push(tag);
            break;
          default:
            BLOWUP_FLAVOR_NOT_KNOWN();
        }
      }
      stuff = '[' + out.join() + ']';
      if (has_epic) {
        stuff = 'oE.kids(' + stuff + ')';
      }
      if (fwrap) {
        stuff = 'function(){return ' + stuff + '}';
      }
      return stuff;
    };
    content = 'return ' + doChildren(children);
    _log2(f, 'final', content);
    return {
      content: content,
      defer: stats.defer,
      can_componentize: children.length === 1 && stats.epic === 0
    };
  };

  if (typeof window !== "undefined" && window !== null) {
    E.Extra.ParseFile = ParseFile;
  } else {
    module.exports = function(w) {
      return w.E.Extra.ParseFile = ParseFile;
    };
  }

}).call(this);
