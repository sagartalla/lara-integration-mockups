(function() {
  var PermissionForm;

  PermissionForm = (function() {

    function PermissionForm(checkbox) {
      this.checkbox = checkbox;
      this.form = this.checkbox.up('form');
      this.bind_events();
    }

    PermissionForm.prototype.bind_events = function() {
      var _this = this;
      this.checkbox.stopObserving('click');
      return this.checkbox.observe("click", function(evt) {
        return _this.update_checkbox();
      });
    };

    PermissionForm.prototype.update_checkbox = function() {
      var last_value,
        _this = this;
      last_value = !this.checkbox.checked;
      this.form.request({
        onSuccess: function() {
          return _this.form.enable();
        },
        onFailure: function() {
          _this.form.enable();
          _this.form.highlight({
            startcolor: '#ff0000'
          });
          return _this.checkbox.checked = last_value;
        }
      });
      return this.form.disable();
    };

    return PermissionForm;

  })();

  document.observe("dom:loaded", function() {
    return $$("input.permission_checkbox").each(function(item) {
      var reporter;
      return reporter = new PermissionForm(item);
    });
  });

}).call(this);
