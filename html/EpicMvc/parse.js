// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var FindVars, ParseFile;

  FindVars = function(text) {
    var args, hash_part, i, last, parts, _ref;
    parts = text.split(/&([a-zA-Z0-9_]+\/[^;]{1,50});?/gm);
    i = 0;
    if (parts.length === 1) {
      return text;
    }
    while (i < parts.length - 1) {
      args = parts[i + 1].split('/');
      last = args.length - 1;
      _ref = args[last].split('#'), args[last] = _ref[0], hash_part = _ref[1];
      parts[i + 1] = (function() {
        switch (args.length) {
          case 2:
            return ['varGet2', [args[0], args[1], hash_part]];
          case 3:
            return ['varGet3', [args[0], args[1], args[2], hash_part]];
          default:
            throw "VarGet reference did not have just 2 or 3 slashes (" + parts[i + 1] + ")";
        }
      })();
      i += 2;
    }
    return parts;
  };

  ParseFile = function(file_stats, file_contents) {
    var a, attr, attr_split, clean, empty, finish, i, oi, parts, t, tag_wait, _i, _ref;
    clean = file_contents.replace(/<!--.*?-->/, '');
    parts = clean.split(/<(\/?)epic:([a-z_0-9]+)([^>]*)>/);
    i = 0;
    tag_wait = [];
    finish = [];
    while (i < parts.length - 1) {
      parts[i] = FindVars(parts[i]);
      if (parts[i + 1] === '/') {
        if (!tag_wait.length) {
          throw "Close tag found when none expected close=" + parts[i + 2];
        }
        oi = tag_wait.pop();
        if (parts[i + 2] !== parts[oi + 2]) {
          throw "Mismatched tags open=" + parts[oi + 2] + ", close=" + parts[i + 2];
        }
        finish[0] = i + 4;
        parts[oi + 1] = finish;
        finish = tag_wait.pop();
        parts[i + 1] = parts[i + 2] = '';
      } else {
        finish.push(i + 1);
        attr = {};
        empty = false;
        if (parts[i + 3].length > 0) {
          attr_split = parts[i + 3].trim().split(/\s*=\s*"([^"]*)"\s*/);
          empty = attr_split.pop() === '/';
          parts[i + 3] = attr_split;
          for (a = _i = 0, _ref = attr_split.length; _i < _ref; a = _i += 2) {
            attr[attr_split[a].toLowerCase()] = FindVars(attr_split[a + 1]);
          }
        }
        parts[i + 3] = attr;
        if (empty === true) {
          parts[i + 1] = [i + 4];
        } else {
          tag_wait.push(finish);
          finish = [-1];
          tag_wait.push(i);
        }
      }
      i += 4;
    }
    if (tag_wait.length) {
      throw "Missing closing epic tags" + (((function() {
        var _j, _len, _results;
        _results = [];
        for (_j = 0, _len = tag_wait.length; _j < _len; _j++) {
          t = tag_wait[_j];
          _results.push(parts[t + 2]);
        }
        return _results;
      })()).join(', '));
    }
    parts[i] = FindVars(parts[i]);
    parts.push(finish);
    return parts;
  };

  window.EpicMvc.ParseFile = ParseFile;

}).call(this);
