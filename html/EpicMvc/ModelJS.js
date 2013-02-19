// Generated by CoffeeScript 1.4.0
(function() {
  'use strict';

  var ModelJS;

  ModelJS = (function() {

    function ModelJS(Epic, view_nm) {
      this.Epic = Epic;
      this.view_nm = view_nm;
      this.restoreState(false);
    }

    ModelJS.prototype.getTable = function(tbl_nm) {
      this.loadTableIf(tbl_nm);
      return this.Table[tbl_nm];
    };

    ModelJS.prototype.loadTableIf = function(tbl_nm) {
      if (!(tbl_nm in this.Table)) {
        return this.loadTable(tbl_nm);
      }
    };

    ModelJS.prototype.restoreState = function(copy_of_state) {
      this.Epic.log2(':restoreState+' + this.view_nm, copy_of_state);
      if (this.ss != null) {
        $.extend(true, this, this.ss);
      }
      if (copy_of_state) {
        $.extend(true, this, copy_of_state);
      }
      return this.Table = {};
    };

    ModelJS.prototype.saveState = function() {
      var nm, st;
      if (this.ss == null) {
        return false;
      }
      st = {};
      for (nm in this.ss) {
        if (this[nm] !== this.ss[nm]) {
          st[nm] = this[nm];
        }
      }
      return $.extend(true, {}, st);
    };

    return ModelJS;

  })();

  window.EpicMvc.ModelJS = ModelJS;

}).call(this);
