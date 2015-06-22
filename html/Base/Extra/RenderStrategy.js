// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var ENTER_KEY, ESCAPE_KEY, RenderStrategy$Base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ENTER_KEY = 13;

  ESCAPE_KEY = 27;

  RenderStrategy$Base = (function() {

    function RenderStrategy$Base() {
      this.m_redraw = __bind(this.m_redraw, this);

      this.onPopState = __bind(this.onPopState, this);

      this.handleEvent = __bind(this.handleEvent, this);

      var baseDiv, modalDiv, s,
        _this = this;
      this.very_first = true;
      this.was_popped = false;
      this.was_modal = false;
      this.last_path = 'not_set';
      this.unloadMsgs = {};
      this.baseUrl = window.document.location.pathname;
      this.baseId = "epic-new-page";
      this.modalId = "epic-new-modal";
      baseDiv = document.createElement('div');
      baseDiv.id = this.baseId;
      document.body.appendChild(baseDiv);
      modalDiv = document.createElement('div');
      modalDiv.id = this.modalId;
      document.body.appendChild(modalDiv);
      setTimeout((function() {
        return _this.onPopState(true);
      }), 0);
      window.onpopstate = this.onPopState;
      this.redraw_guard = 0;
      s = m.redraw.strategy;
      m.redraw = this.m_redraw;
      m.redraw.strategy = s;
      this.init();
      true;
    }

    RenderStrategy$Base.prototype.handleEvent = function(event_obj) {
      var attrs, data_action, data_params, f, files, ix, nm, old_params, prevent, rec, target, type, val, _i, _j, _len, _ref, _ref1, _ref2;
      f = 'on[data-e-action]';
      _log2(f, 'top', this.redraw_guard, (event_obj != null ? event_obj : window.event).type);
      if (event_obj == null) {
        event_obj = window.event;
      }
      type = event_obj.type;
      if (type === 'input') {
        type = 'change';
      }
      if (type === 'mousedown') {
        if (event_obj.which === 1 || event_obj.button === 1) {
          type = 'click';
        } else if (event_obj.which === 3 || event_obj.button === 2) {
          type = 'rclick';
        } else {
          return;
        }
      }
      if (type === 'keyup' && event_obj.keyCode === 9) {
        return;
      }
      if (type === 'keyup') {
        switch (event_obj.keyCode) {
          case ENTER_KEY:
            type = 'enter';
            break;
          case ESCAPE_KEY:
            type = 'escape';
        }
      }
      target = event_obj.target;
      if (target === window) {
        return false;
      }
      while (target.tagName !== 'BODY' && !(data_action = target.getAttribute('data-e-action'))) {
        target = target.parentElement;
      }
      E.option.event(type, event_obj, target, data_action);
      if (!data_action) {
        return false;
      }
      data_params = {};
      attrs = target.attributes;
      for (ix = _i = 0, _ref = attrs.length; 0 <= _ref ? _i < _ref : _i > _ref; ix = 0 <= _ref ? ++_i : --_i) {
        if (!('data-e-' === attrs[ix].name.slice(0, 7))) {
          continue;
        }
        if ('action' === (nm = attrs[ix].name.slice(7))) {
          continue;
        }
        data_params[nm] = attrs[ix].value;
      }
      val = target.value;
      if (target.type === 'checkbox' && target.checked === false) {
        val = false;
      }
      files = target.files;
      _log2(f, 'event', {
        type: type,
        data_action: data_action,
        data_params: data_params,
        val: val,
        files: files
      }, target);
      data_params.val = val;
      data_params._files = files;
      _ref1 = ['touches', 'changedTouches', 'targetTouches'];
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        nm = _ref1[_j];
        if (nm in event_obj) {
          data_params[nm] = event_obj[nm];
        }
      }
      old_params = target.getAttribute('data-params');
      if (old_params) {
        _ref2 = JSON.parse(old_params);
        for (nm in _ref2) {
          rec = _ref2[nm];
          data_params[nm] = rec;
        }
      }
      prevent = E.Extra[E.option.dataAction](type, data_action, data_params);
      if (prevent) {
        event_obj.preventDefault();
      }
      return false;
    };

    RenderStrategy$Base.prototype.init = function() {
      var event_name, interesting, _i, _len, _results;
      interesting = ['mousedown', 'dblclick', 'keyup', 'blur', 'focus', 'change', 'input', 'touchstart', 'touchmove', 'touchend'];
      _results = [];
      for (_i = 0, _len = interesting.length; _i < _len; _i++) {
        event_name = interesting[_i];
        _results.push(document.body.addEventListener(event_name, this.handleEvent, true));
      }
      return _results;
    };

    RenderStrategy$Base.prototype.UnloadMessage = function(ix, msg) {
      var new_msg, nm, rec;
      if (msg) {
        this.unloadMsgs[ix] = msg;
      } else {
        delete this.unloadMsgs[ix];
      }
      new_msg = (function() {
        var _ref, _results;
        _ref = this.unloadMsgs;
        _results = [];
        for (nm in _ref) {
          rec = _ref[nm];
          _results.push(rec);
        }
        return _results;
      }).call(this);
      new_msg = new_msg.length ? new_msg.join("\n") : null;
      return window.onbeforeunload = function() {
        return new_msg;
      };
    };

    RenderStrategy$Base.prototype.onPopState = function(event) {
      var f;
      f = 'E:bootstrap.onPopState: ';
      _log2(f, {
        was_popped: this.was_popped,
        very_first: this.very_first
      }, true, {
        state: event === true ? 'X' : event.state
      });
      if (event === true || !event.state) {
        if (this.was_popped || !this.very_first) {
          E.action('browser_rehash', {
            hash: location.hash.substr(1)
          });
          return;
        }
      }
      this.was_popped = true;
      if (this.very_first) {
        E.action('browser_hash', {
          hash: location.hash.substr(1)
        });
      } else {
        if (event.state) {
          E.setModelState(event.state);
        }
        m.startComputation();
        m.endComputation();
      }
    };

    RenderStrategy$Base.prototype.m_redraw = function() {
      var f,
        _this = this;
      f = 'm_redraw';
      this.redraw_guard++;
      if (this.redraw_guard !== 1) {
        _log2(f, 'GUARD REDRAW', this.redraw_guard);
        return;
      }
      return E.View().run().then(function(modal_content) {
        var content, modal;
        modal = modal_content[0], content = modal_content[1];
        _log2('DEFER-R', 'RESULTS: modal, content', _this.redraw_guard, modal, content);
        _this.render(modal, content);
        _this.redraw_guard--;
        if (_this.redraw_guard !== 0) {
          _this.redraw_guard = 0;
          return setTimeout((function() {
            return _this.m_redraw();
          }), 16);
        }
      }).then(null, function(err) {
        return console.error('RenderStrategy$Base m_redraw', err);
      });
    };

    RenderStrategy$Base.prototype.render = function(modal, content) {
      var container, f, start;
      f = 'render';
      start = new Date().getTime();
      _log2(f, 'START RENDER', start, modal);
      if (modal) {
        m.render((container = document.getElementById(this.modalId)), content);
      } else {
        if (this.was_modal) {
          m.render(document.getElementById(this.modalId), []);
        }
        m.render((container = document.getElementById(this.baseId)), m('div', {}, content));
      }
      _log2(f, 'END RENDER', new Date().getTime() - start);
      if (!modal) {
        this.handleRenderState();
      }
      this.was_modal = modal;
      this.was_popped = false;
      this.very_first = false;
    };

    RenderStrategy$Base.prototype.handleRenderState = function() {
      var displayHash, f, history, model_state, new_hash, path, route, str_path, _base, _base1;
      path = E.App().getStepPath();
      str_path = path.join('/');
      history = str_path === this.last_path ? 'replace' : true;
      f = 'E:handleRenderState:' + history + ':' + str_path;
      _log2(f, {
        vf: this.very_first,
        wp: this.was_popped
      });
      if (!history) {
        return;
      }
      displayHash = '';
      new_hash = false;
      route = E.appFindAttr(path[0], path[1], path[2], 'route');
      if ((E.type_oau(route)) === 'O' && 'model' in route) {
        new_hash = E[route.model]().route(route);
      }
      if (typeof route === 'string') {
        new_hash = route;
      }
      if (new_hash !== false) {
        displayHash = new_hash;
      }
      model_state = E.getModelState();
      if (this.very_first || history === 'replace') {
        if (typeof (_base = window.history).replaceState === "function") {
          _base.replaceState(model_state, displayHash, '#' + displayHash);
        }
      } else if (!this.was_popped && history === true) {
        if (typeof (_base1 = window.history).pushState === "function") {
          _base1.pushState(model_state, displayHash, '#' + displayHash);
        }
        window.document.title = displayHash;
      }
      this.last_path = str_path;
    };

    return RenderStrategy$Base;

  })();

  E.Extra.RenderStrategy$Base = RenderStrategy$Base;

}).call(this);
