// Generated by CoffeeScript 1.9.2
(function() {
  var dataAction,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  dataAction = function(type, data_action, data_params) {
    var action_specs, base, do_action, f, group, i, interesting, item, len, one_spec, prevent, ref, spec_action, spec_type;
    f = 'Base:E/dataAction:on[data-e-action]' + type;
    if (typeof (base = E.option).activity === "function") {
      base.activity(type);
    }
    action_specs = data_action.split(',');
    do_action = true;
    prevent = false;
    for (i = 0, len = action_specs.length; i < len; i++) {
      one_spec = action_specs[i];
      ref = one_spec.split(':'), spec_type = ref[0], spec_action = ref[1], group = ref[2], item = ref[3], interesting = ref[4];
      if (!spec_action) {
        spec_action = spec_type;
        spec_type = 'click';
      }
      if (spec_type === 'event') {
        E.event(spec_action, type, group, item, interesting, data_params);
      }
      if (do_action && spec_type === type) {
        if (spec_type === 'click' || spec_type === 'rclick') {
          prevent = true;
        }
        do_action = false;
        E.action(spec_action, data_params);
      }
    }
    return prevent;
  };

  E.Extra.dataAction$Base = dataAction;

  E.event = function(name, type, group, item, interesting, params) {
    var event_names, ref;
    if (interesting !== 'all') {
      event_names = interesting.split('-');
      if (indexOf.call(event_names, type) < 0) {
        return;
      }
    }
    if (name === 'Fist') {
      name = (ref = E.fistDef[group].event) != null ? ref : name;
    }
    return E[name]().event(name, type, group, item, params);
  };

}).call(this);
