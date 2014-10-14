(function() {
  var LightboxReport;

  LightboxReport = (function() {

    function LightboxReport(link_elm) {
      this.link_elm = link_elm;
      this.parseOfferingUrl(this.link_elm.href);
      this.lightbox_elm = $('lightbox_wrapper');
      this.last_update_time = 0;
      this.report_dom = 'report';
      this.report_elm = $(this.report_dom);
      this.close_elm = $('lightbox_closer');
      this.interval_id = null;
      this.update_interval_ms = 5 * 1000;
      this.rebindEvents();
    }

    LightboxReport.prototype.rebindEvents = function() {
      var _this = this;
      $(document).stopObserving('keydown');
      this.close_elm.stopObserving('click');
      this.link_elm.stopObserving('click');
      $(document).observe('keydown', function(evt) {
        return _this.handleKedown(evt);
      });
      this.close_elm.observe("click", function(evt) {
        return _this.hideLightBox();
      });
      return this.link_elm.observe("click", function(evt) {
        evt.preventDefault();
        return _this.showLightBox();
      });
    };

    LightboxReport.prototype.updateReport = function() {
      return new Ajax.Updater(this.report_dom, this.report_url);
    };

    LightboxReport.prototype.enableUpdates = function() {
      var update_func,
        _this = this;
      this.disableUpdates();
      this.updateReport();
      update_func = function() {
        _this.save_scroll_position();
        return new Ajax.Request(_this.updated_at_url, {
          method: "get",
          onSuccess: function(transport) {
            if (_this.isItUpdatetime(transport.responseText)) {
              _this.updateReport();
              _this.restore_scroll_position();
            }
            return _this.timeout_id = setTimeout(update_func, _this.update_interval_ms);
          }
        });
      };
      this.timeout_id = setTimeout(update_func, this.update_interval_ms);
      return this.rebindEvents();
    };

    LightboxReport.prototype.disableUpdates = function() {
      if (this.timeout_id) {
        clearTimeout(this.timeout_id);
        return this.timeout_id = null;
      }
    };

    LightboxReport.prototype.showLightBox = function() {
      this.enableUpdates();
      return this.lightbox_elm.show();
    };

    LightboxReport.prototype.save_scroll_position = function() {
      return this.last_scroll_position = document.viewport.getScrollOffsets();
    };

    LightboxReport.prototype.restore_scroll_position = function() {
      if (this.last_scroll_position) {
        return window.scrollTo(this.last_scroll_position.left, this.last_scroll_position.top);
      }
    };

    LightboxReport.prototype.hideLightBox = function() {
      this.disableUpdates();
      return this.lightbox_elm.hide();
    };

    LightboxReport.prototype.updatedAtBaseUrl = "/report/learner/updated_at/999";

    LightboxReport.prototype.parseOfferingUrl = function(url) {
      this.report_url = url.match(/\/.*portal\/offerings\/\d+\/student_report/gi).first();
      if (this.report_url != null) {
        this.offering_id = this.report_url.match(/\d+/gi).last();
        return this.updated_at_url = this.updatedAtBaseUrl.replace(/999/, this.offering_id);
      }
    };

    LightboxReport.prototype.isItUpdatetime = function(response) {
      var should_we_udpate, this_time;
      should_we_udpate = false;
      if (response) {
        this_time = parseInt(response);
        this.last_update_time;
        if (this_time && this_time > this.last_update_time) {
          this.last_update_time = this_time;
          should_we_udpate = true;
        }
      }
      return should_we_udpate;
    };

    LightboxReport.prototype.handleKedown = function(e) {
      var code;
      if (e.keyCode) {
        code = e.keyCode;
      } else if (e.which) {
        code = e.which;
      }
      switch (code) {
        case 27:
          return this.hideLightBox();
      }
    };

    return LightboxReport;

  })();

  document.observe("dom:loaded", function() {
    return $$(".lightbox_report_link>a").each(function(item) {
      var reporter;
      return reporter = new LightboxReport(item);
    });
  });

}).call(this);
