// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var ENTER_KEY, RenderStrategy$Base,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ENTER_KEY = 13;

  RenderStrategy$Base = (function() {

    function RenderStrategy$Base() {
      this.m_redraw = __bind(this.m_redraw, this);

      this.onPopState = __bind(this.onPopState, this);

      this.handleEvent = __bind(this.handleEvent, this);

      var baseDiv,
        _this = this;
      this.very_first = true;
      this.was_popped = false;
      this.was_modal = false;
      this.unloadMsgs = {};
      this.baseUrl = window.document.location.pathname;
      this.baseId = "epic-new-page";
      this.modalId = "epic-new-modal";
      this.basePage = '<div id="' + this.baseId + '"></div><div id="' + this.modalId + '"></div>';
      baseDiv = document.createElement('div');
      baseDiv.id = this.baseId;
      document.body.appendChild(baseDiv);
      setTimeout((function() {
        return _this.onPopState(true);
      }), 0);
      window.onpopstate = this.onPopState;
      this.redraw_guard = 0;
      m.redraw = this.m_redraw;
      this.init();
      true;
    }

    RenderStrategy$Base.prototype.handleEvent = function(event_obj) {
      var attrs, data_action, data_params, f, ix, nm, old_params, prevent, rec, target, type, val, _i, _ref, _ref1;
      f = 'on[data-e-action]';
      if (event_obj == null) {
        event_obj = window.event;
      }
      type = event_obj.type;
      if (type === 'keyup' && event_obj.keyCode === ENTER_KEY) {
        type = 'enter';
      }
      target = event_obj.target;
      if (target === window) {
        return false;
      }
      while (target.tagName !== 'BODY' && !(data_action = target.getAttribute('data-e-action'))) {
        target = target.parentElement;
      }
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
      data_params.val = val;
      old_params = target.getAttribute('data-params');
      if (old_params) {
        _ref1 = JSON.parse(old_params);
        for (nm in _ref1) {
          rec = _ref1[nm];
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
      interesting = ['click', 'change', 'dblclick', 'keyup', 'blur', 'focus'];
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
        BROKEN() || this.render();
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
      return E.View().run().then(function(content) {
        _this.redraw_guard--;
        if (_this.redraw_guard !== 0) {
          _this.redraw_guard = 0;
          setTimeout((function() {
            return _this.m_redraw();
          }), 16);
        }
        return _this.render(content, 'TODO', 'TODO', false);
      }).then(null, function(err) {
        return console.error('RenderStrategy$Base m_redraw', err);
      });
    };

    RenderStrategy$Base.prototype.render = function(content, history, action, modal) {
      var container, f, start;
      f = 'render';
      if (this.was_modal) {
        BROKEN();
        m.render(document.getElementById(this.modalId), m());
      }
      if (modal) {
        BROKEN();
        m.render((container = document.getElementById(this.modalId)), this.modalView(content));
      } else {
        start = new Date().getTime();
        m.render((container = document.getElementById(this.baseId)), m('div', {}, content));
        _log2(f, 'END RENDER', new Date().getTime() - start);
      }
      this.was_modal = modal;
      this.was_popped = false;
      this.very_first = false;
    };

    RenderStrategy$Base.prototype.handleRenderState = function(history, action) {
      var displayHash, f, model_state, new_hash, _base, _base1;
      f = 'E:bootstrap.handleRenderState:' + history + ':' + action;
      _log2(f, {
        vf: this.very_first,
        wp: this.was_popped
      });
      if (!history) {
        return;
      }
      displayHash = this.very_first ? '' : 'action-' + action;
      new_hash = E.getDomCache();
      if (new_hash === false) {
        new_hash = E.getExternalUrl();
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
    };

    return RenderStrategy$Base;

  })();

  E.Extra.RenderStrategy$Base = RenderStrategy$Base;

}).call(this);
