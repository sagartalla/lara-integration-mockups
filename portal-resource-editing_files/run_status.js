(function() {
  var RunStatus;

  RunStatus = (function() {

    function RunStatus(buttonElem) {
      var _this = this;
      this.buttonElem = buttonElem;
      this.parse_offering_url(this.buttonElem.href);
      this.run_button_elm = this.buttonElem.up('.run_buttons');
      this.run_status_elm = this.run_button_elm.next('.run_in_progress');
      this.message_elm = this.run_status_elm.down('.message');
      this.spinner_elm = this.run_status_elm.down('.wait_image');
      this.showing_run_status = false;
      if (this.run_button_elm && this.run_status_elm) {
        this.buttonElem.observe("click", function(evt) {
          _this.toggleRunStatusView();
          return _this.trigger_status_updates();
        });
      }
    }

    RunStatus.prototype.toggleRunStatusView = function() {
      if (this.showing_run_status) {
        this.showing_run_status = false;
        return this.hide_run_status();
      } else {
        this.showing_run_status = true;
        return this.show_run_status();
      }
    };

    RunStatus.prototype.show_run_status = function() {
      this.run_button_elm.hide();
      return this.run_status_elm.show();
    };

    RunStatus.prototype.hide_run_status = function() {
      this.run_button_elm.show();
      this.run_status_elm.hide();
      if (this.interval_id) {
        clearInterval(this.interval_id);
      }
      return this.interval_id = null;
    };

    RunStatus.prototype.parse_offering_url = function(url) {
      this.offering_id = url.match(/\/offerings\/\d+/)[0];
      if (this.offering_id) {
        return this.offering_id = this.offering_id.match(/\d+/)[0];
      }
    };

    RunStatus.prototype.update_status = function(msg) {
      return this.message_elm.update(msg);
    };

    RunStatus.prototype.we_are_waiting = function() {
      this.message_elm.addClassName('waiting');
      this.message_elm.removeClassName('ready');
      return this.spinner_elm.show();
    };

    RunStatus.prototype.we_are_ready = function() {
      this.message_elm.addClassName('ready');
      this.message_elm.removeClassName('waiting');
      return this.spinner_elm.hide();
    };

    RunStatus.prototype.handle_error = function(msg) {
      return this.message_elm.update(msg);
    };

    RunStatus.prototype.stop_status_updates = function() {
      this.update_status('completed');
      return this.hide_run_status();
    };

    RunStatus.prototype.trigger_status_updates = function() {
      var update_status,
        _this = this;
      if (this.interval_id !== null) {
        clearInterval(this.interval_id);
        this.interval_id = null;
      }
      this.we_are_waiting();
      update_status = function() {
        return new Ajax.Request('/portal/offerings/' + _this.offering_id + '/launch_status.json', {
          method: 'get',
          onSuccess: function(transport) {
            var status_event;
            status_event = transport.responseJSON;
            if (!!status_event.event_details) {
              _this.update_status(status_event.event_details);
            }
            if (!!status_event && status_event.event_type === "activity_otml_requested") {
              _this.we_are_ready();
            }
            if (!!status_event && (status_event.event_type === "no_session" || status.event_type === "bundle_saved")) {
              return _this.stop_status_updates();
            }
          },
          onFailure: function() {
            return this.handle_error("launch status failure");
          }
        });
      };
      this.update_status("Requesting activity launcher...");
      return this.interval_id = setInterval(update_status, 5000);
    };

    return RunStatus;

  })();

  document.observe("dom:loaded", function() {
    $$("a.button.run.solo").each(function(item) {
      var runstatus;
      return runstatus = new RunStatus(item);
    });
    return $$("a.button.run.in_group").each(function(item) {
      var callback;
      callback = function(arg) {
        var runstatus;
        runstatus = new RunStatus(item);
        runstatus.toggleRunStatusView();
        return runstatus.trigger_status_updates();
      };
      return EnableWorkgroup(item, callback);
    });
  });

}).call(this);
