(function() {
  var CreateStatus;

  CreateStatus = (function() {

    function CreateStatus(parentElem, registerListener) {
      var _this = this;
      this.parentElem = parentElem;
      if (registerListener == null) {
        registerListener = true;
      }
      this.link_elm = this.parentElem.down('input');
      this.create_status_elm = this.parentElem.down('.create_in_progress');
      if (this.link_elm && this.create_status_elm && registerListener) {
        this.link_elm.observe("click", function(evt) {
          return _this.hideButton();
        });
      }
    }

    CreateStatus.prototype.hideButton = function() {
      this.link_elm.hide();
      return this.create_status_elm.show();
    };

    CreateStatus.prototype.showButton = function() {
      this.link_elm.show();
      return this.create_status_elm.hide();
    };

    return CreateStatus;

  })();

  window.CreateStatus = CreateStatus;

  document.observe("dom:loaded", function() {
    return $$(".create_button").each(function(item) {
      var createstatus;
      return createstatus = new CreateStatus(item);
    });
  });

}).call(this);
