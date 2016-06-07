// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var Issue;

  Issue = (function() {

    function Issue(Epic, t_view, t_action) {
      this.Epic = Epic;
      this.t_view = t_view;
      this.t_action = t_action;
      this.issue_list = [];
    }

    Issue.Make = function(epic, view, type, value_list) {
      var issue;
      issue = new window.EpicMvc.Issue(epic, view);
      issue.add(type, value_list);
      return issue;
    };

    Issue.prototype.add = function(type, msgs) {
      var f;
      f = ':Issue.add:' + this.t_view + ':' + this.t_action;
      this.Epic.log2(f, 'params:type/msgs', type, msgs);
      switch (typeof msgs) {
        case 'undefined':
          msgs = [];
          break;
        case 'string':
          msgs = [msgs];
      }
      switch (type) {
        case 'TEXT':
          return this.issue_list.push({
            token: 'text',
            more: msgs,
            t_view: this.t_view,
            t_action: this.t_action
          });
        default:
          if (/^[a-zA-Z0-9_]+$/.test(type)) {
            return this.issue_list.push({
              token: type,
              more: msgs,
              t_view: this.t_view,
              t_action: this.t_action
            });
          } else {
            alert(f + ' - Unknown "type" for Issue.add ' + type);
            return this.issue_list.push({
              token: 'unknown',
              more: [type],
              t_view: this.t_view,
              t_action: this.t_action
            });
          }
      }
    };

    Issue.prototype.call = function(function_call_returning_issue_or_null) {
      if (function_call_returning_issue_or_null) {
        this.addObj(function_call_returning_issue_or_null);
      }
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
        new_issue = $.extend(true, {}, issue);
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

    Issue.prototype.asTable = function(map) {
      var final, issue, _i, _len, _ref;
      final = [];
      _ref = this.issue_list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        issue = _ref[_i];
        final.push({
          token: issue.token,
          title: "" + issue.t_view + "#" + issue.t_action + "#" + issue.token + "#" + (issue.more.join(',')),
          issue: this.map(map, issue.t_view, issue.t_action, issue.token, issue.more)
        });
      }
      return final;
    };

    Issue.prototype.map = function(map, t_view, t_action, token, more) {
      var map_list, spec, sub_map, _i, _j, _len, _len1, _ref;
      if (typeof map !== 'object') {
        return "" + t_view + "#" + t_action + "#" + token + "#" + (more.join(','));
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
      return "" + t_view + "#" + t_action + "#" + token + "#" + (more.join(','));
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

  window.EpicMvc.Issue = Issue;

}).call(this);
