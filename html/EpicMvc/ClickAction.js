// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var ClickAction,
    __hasProp = {}.hasOwnProperty;

  ClickAction = (function() {

    function ClickAction(Epic) {
      this.Epic = Epic;
    }

    ClickAction.prototype.click = function(action_token, path) {
      var click_node, f, issue, limit, message, r, rIssues, rMessages, rNode, rResults;
      f = ":ClickAction.click(" + action_token + ")";
      issue = new window.EpicMvc.Issue(this.Epic, 'ClickAction');
      message = new window.EpicMvc.Issue(this.Epic, 'ClickAction');
      if (!(action_token != null)) {
        if (!(action_token = this.Epic.request().haveAction())) {
          return [issue, message];
        }
        path = this.Epic.getInstance('Pageflow').getStepPath();
      }
      click_node = this.Epic.appConf().findClick(path, action_token);
      if (!(click_node != null)) {
        this.Epic.log1(f, 'no match', {
          path: path,
          action_token: action_token
        });
        return [issue, message];
      }
      r = this.doAction(click_node, {});
      rNode = r[0], rResults = r[1], rIssues = r[2], rMessages = r[3];
      issue.addObj(rIssues);
      message.addObj(rMessages);
      limit = 5;
      while (rNode) {
        if (--limit < 0) {
          throw 'Max recurse limit ClickAction.click';
        }
        r = this.doAction(rNode, rResults);
        rNode = r[0], rResults = r[1], rIssues = r[2], rMessages = r[3];
        issue.addObj(rIssues);
        message.addObj(rMessages);
      }
      return [issue, message];
    };

    ClickAction.prototype.doAction = function(node, prev_action_result) {
      var a_params_list, alias_params, class_method, dummy, f, found_result_tag, k, look_for_macro_result_tags, macro_node, path, r, rIssues, rMessages, rResults, r_vals, v;
      f = ":ClickAction.doAction(" + (node.getTarget()) + ")";
      r_vals = this.Epic.request().getValues();
      a_params_list = this.pullValueUsingAttr(node, r_vals, prev_action_result);
      class_method = node.getTarget();
      look_for_macro_result_tags = false;
      if (node.hasMacro()) {
        macro_node = this.Epic.appConf().getMacroNode(class_method);
        alias_params = this.pullValueUsingAttr(macro_node, r_vals, prev_action_result);
        class_method = macro_node.getTarget();
        if (macro_node.hasResult()) {
          look_for_macro_result_tags = true;
        }
        for (k in alias_params) {
          if (!__hasProp.call(alias_params, k)) continue;
          v = alias_params[k];
          a_params_list[k] = v;
        }
        if (path = macro_node.hasAttr('go')) {
          dummy = this.Epic.Execute('Pageflow/path', {
            path: path
          });
        }
      }
      r = class_method ? this.Epic.Execute(class_method, a_params_list) : [{}, {}, {}];
      if (path = node.hasAttr('go')) {
        dummy = this.Epic.Execute('Pageflow/path', {
          path: path
        });
      }
      rResults = r[0], rIssues = r[1], rMessages = r[2];
      found_result_tag = (look_for_macro_result_tags ? macro_node : node).matchResult(rResults);
      return [found_result_tag, rResults, rIssues, rMessages];
    };

    ClickAction.prototype.pullValueUsingAttr = function(node, r_vals, prev_action_result) {
      var a_params_list, attr, f, fields_list, form_name, nm, oF;
      f = ':ClickAction.pullValueUsingAttr';
      a_params_list = $.extend({}, node.getPAttrs());
      if (form_name = node.hasAttr('use_form')) {
        oF = this.Epic.getFistInstance(form_name);
        fields_list = (function() {
          var _results;
          _results = [];
          for (nm in oF.getHtmlFieldValues()) {
            _results.push(nm);
          }
          return _results;
        })();
        $.extend(a_params_list, this.pullValues(r_vals, fields_list, 'use_form'));
      }
      if (attr = node.hasAttr('use_fields')) {
        $.extend(a_params_list, this.pullValues(r_vals, attr.split(','), 'use_fields'));
      }
      if (attr = node.hasAttr('use_result')) {
        $.extend(a_params_list, this.pullValues(prev_action_result, attr.split(','), 'use_result'));
      }
      return a_params_list;
    };

    ClickAction.prototype.pullValues = function(source, value_list, attr_nm) {
      var alias, f, nm, nm_alias, out_list, _i, _len, _ref;
      f = ':ClickAction.pullValues';
      out_list = {};
      for (_i = 0, _len = value_list.length; _i < _len; _i++) {
        nm_alias = value_list[_i];
        switch (attr_nm) {
          case 'use_fields':
          case 'use_result':
            _ref = nm_alias.split(':'), nm = _ref[0], alias = _ref[1];
            if (alias == null) {
              alias = nm;
            }
            break;
          default:
            nm = alias = nm_alias;
        }
        out_list[alias] = source[nm];
      }
      return out_list;
    };

    return ClickAction;

  })();

  window.EpicMvc.ClickAction = ClickAction;

}).call(this);
