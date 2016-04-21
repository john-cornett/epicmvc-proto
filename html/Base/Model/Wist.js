// Generated by CoffeeScript 1.9.2
(function() {
  var Wist,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Wist = (function(superClass) {
    extend(Wist, superClass);

    function Wist(view_nm, options) {
      Wist.__super__.constructor.call(this, view_nm, options);
      this.wist = {};
    }

    Wist.prototype.loadTable = function(tbl_nm) {
      var f;
      f = "Wist:loadTable:" + tbl_nm;
      _log2(f);
      return this.Table[tbl_nm] = (this._getWist(tbl_nm)).table;
    };

    Wist.prototype._getWist = function(wistNm) {
      var hash, nm, rec, table;
      if (!(wistNm in this.wist)) {
        E.option.w1(wistNm);
        hash = E.wistDef[wistNm];
        table = [];
        for (nm in hash) {
          rec = hash[nm];
          rec.token = String(nm);
          table.push(rec);
        }
        this.wist[wistNm] = {
          hash: hash,
          table: table
        };
      }
      return this.wist[wistNm];
    };

    return Wist;

  })(E.ModelJS);

  E.Model.Wist$Base = Wist;

}).call(this);
