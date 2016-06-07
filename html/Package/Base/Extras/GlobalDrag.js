// Generated by CoffeeScript 1.8.0
(function() {
  var GlobalDrag,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GlobalDrag = (function() {
    function GlobalDrag(pre_flight) {
      this.pre_flight = pre_flight;
      this.data = __bind(this.data, this);
      this.check = __bind(this.check, this);
      this.target_drop = __bind(this.target_drop, this);
      this.target_dragleave = __bind(this.target_dragleave, this);
      this.target_dragenter = __bind(this.target_dragenter, this);
      this.target_dragover = __bind(this.target_dragover, this);
      this.source_dragend = __bind(this.source_dragend, this);
      this.source_dragstart = __bind(this.source_dragstart, this);
      this.update = __bind(this.update, this);
      this.handleDragLeave = __bind(this.handleDragLeave, this);
      this.handleDragEnter = __bind(this.handleDragEnter, this);
      this.handleDragOver = __bind(this.handleDragOver, this);
      this.log3 = function() {};
      this.count_enter = 0;
      this.count_leave = 0;
      this.count_target = 0;
      this.src_elem = false;
      this.src_data = false;
      this.drag_type = false;
      $((function(_this) {
        return function() {
          return $(document);
        };
      })(this)).dragenter(this.handleDragEnter).dragleave(this.handleDragLeave).dragover(this.handleDragOver);
    }

    GlobalDrag.prototype.get_type = function(t) {
      this.log3('get_type', t);
      if (t === null || t === void 0) {
        return 'BROKEN';
      }
      if (t && typeof t === 'object') {
        t = t[0];
      }
      if (t === null || t === 'Text' || -1 !== t.indexOf('/')) {
        return false;
      }
      return t;
    };

    GlobalDrag.prototype.handleDragOver = function(evt) {
      if (this.drag_type === false) {
        return true;
      }
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'none';
      return false;
    };

    GlobalDrag.prototype.handleDragEnter = function(evt) {
      return this.light(evt, 'global');
    };

    GlobalDrag.prototype.handleDragLeave = function(evt) {
      return this.unlight(evt, 'global');
    };

    GlobalDrag.prototype.update = function(selector) {
      var container;
      container = $(selector);
      $('.data-drag', container).each((function(_this) {
        return function(ix, el) {
          return $(el).attr('draggable', 'true').dragstart(_this.source_dragstart).dragend(_this.source_dragend);
        };
      })(this));
      return $('.data-drop', container).each((function(_this) {
        return function(ix, el) {
          return $(el).dragover(_this.target_dragover).drop(_this.target_drop).dragenter(_this.target_dragenter).dragleave(_this.target_dragleave);
        };
      })(this));
    };

    GlobalDrag.prototype.source_dragstart = function(e) {
      var $e;
      $e = this.find(e, 'data-drag', false);
      if ($e === false) {
        return false;
      }
      this.src_start($e);
      e.dataTransfer.setData($e.attr('data-drag-type'), $e.attr('data-drag-data'));
      this.log3('start:type/data/$e', $e.attr('data-drag-type'), $e.attr('data-drag-data'), $e);
      return $e.addClass('active-source');
    };

    GlobalDrag.prototype.source_dragend = function(e) {
      var $e;
      $e = $(e.target);
      $e.removeClass('active-source');
      return this.src_end();
    };

    GlobalDrag.prototype.target_dragover = function(e) {
      var $e;
      if (this.drag_type === false) {
        return;
      }
      $e = this.find(e, 'active-target');
      if ($e === false) {
        e.dataTransfer.dropEffect = 'none';
        return true;
      }
      e.preventDefault();
      return false;
    };

    GlobalDrag.prototype.target_dragenter = function(e) {
      var $e;
      this.light(e, 'target');
      $e = this.find(e, 'active-target');
      if ($e === false) {
        return;
      }
      this.count_target += 1;
      return $e.addClass('active-drop');
    };

    GlobalDrag.prototype.target_dragleave = function(e) {
      var $e;
      this.unlight(e, 'target');
      $e = this.find(e, 'active-target');
      if ($e === false) {
        return;
      }
      this.count_target -= 1;
      if (this.count_target === 0) {
        return $e.removeClass('active-drop');
      }
    };

    GlobalDrag.prototype.target_drop = function(e) {
      var $e, action, drag_type, drop_data, params;
      if (this.drag_type === false) {
        return true;
      }
      e.stopPropagation();
      e.preventDefault();
      $e = this.find(e, 'active-target');
      if ($e === false) {
        return true;
      }
      drag_type = this.drag_type;
      action = $e.attr('data-drop-' + drag_type);
      drop_data = this.data($e, 'drop');
      params = $.extend({}, this.src_data, drop_data, {
        event: e
      });
      this.src_end();
      window.EpicMvc.Epic.makeClick(false, action, params, true);
      return false;
    };

    GlobalDrag.prototype.src_start = function($e) {
      this.drag_type = this.get_type($e.attr('data-drag-type'));
      this.log3('src_start drag_type/$e', this.drag_type, $e);
      if (this.drag_type === false) {
        return;
      }
      this.src_elem = $e;
      this.src_data = this.data($e, 'drag');
      this.log3('src_start src_data', this.src_data);
    };

    GlobalDrag.prototype.src_end = function() {
      $('.active-target').removeClass('active-target');
      this.count_target = 0;
      this.count_enter = 0;
      this.count_leave = 0;
      this.src_data = false;
      this.src_elem = false;
      this.drag_type = false;
    };

    GlobalDrag.prototype.light = function(evt, src) {
      var Data, Pre_flight, src_data, type;
      if (this.count_enter === 0) {
        this.count_enter = 1;
        if (this.drag_type === false) {
          this.drag_type = this.get_type(evt.dataTransfer.types);
        }
        type = this.drag_type;
        src_data = this.src_data;
        Data = this.data;
        Pre_flight = this.pre_flight;
        this.log3('light0,type/src/src_data', type, src, src_data);
        $('[data-drop-' + type + ']').not('.active-source').filter(function() {
          if (src_data === false) {
            return true;
          }
          return Pre_flight($(this).attr('data-drop-' + type), $.extend({}, src_data, Data($(this), 'drop')));
        }).addClass('active-target');
        return this.check(false);
      } else {
        return this.count_enter += 1;
      }
    };

    GlobalDrag.prototype.unlight = function(evt, src) {
      return this.count_leave += 1;
    };

    GlobalDrag.prototype.check = function(enter, leave) {
      var current_enter, current_leave;
      if (enter === 0) {
        return;
      }
      if (enter && enter === leave && enter === this.count_enter && leave === this.count_leave) {
        $('.active-target').removeClass('active-target');
        this.count_enter = 0;
        this.count_leave = 0;
        return;
      }
      current_enter = this.count_enter;
      current_leave = this.count_leave;
      return (function(_this) {
        return function(current_enter, current_leave) {
          return setTimeout((function() {
            return _this.check(current_enter, current_leave);
          }), 200);
        };
      })(this)(current_enter, current_leave);
    };

    GlobalDrag.prototype.data = function($e, drag_or_drop) {
      var data;
      data = $e === false ? drag_or_drop : $e.attr('data-' + drag_or_drop + '-data');
      if (data && data.length) {
        return JSON.parse(data);
      }
      return {};
    };

    GlobalDrag.prototype.find = function(evt, class_nm, traverse) {
      var $e, $e_parent;
      class_nm = '.' + class_nm;
      $e = $(evt.target);
      if ($e.is(class_nm)) {
        return $e;
      }
      if (traverse !== false) {
        $e_parent = $e.parent(class_nm);
        if ($e_parent.is(class_nm)) {
          return $e_parent;
        }
      }
      return false;
    };

    return GlobalDrag;

  })();

  window.EpicMvc.Extras.GlobalDrag = GlobalDrag;

}).call(this);