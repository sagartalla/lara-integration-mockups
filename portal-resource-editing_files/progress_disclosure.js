(function() {
  var ProgressDisclosure;

  ProgressDisclosure = (function() {

    function ProgressDisclosure(disclosure_elem) {
      var _this = this;
      this.disclosure_elem = disclosure_elem;
      this.details_elms = this.disclosure_elem.up('table').select('tr.details');
      this.showing_details = false;
      this.toggleDetailView();
      this.disclosure_elem.observe("click", function(evt) {
        evt.preventDefault();
        return _this.toggleDetailView();
      });
    }

    ProgressDisclosure.prototype.toggleDetailView = function() {
      if (this.showing_details) {
        this.showing_details = false;
        this.hideDetails();
        return this.showClosedDisclosure();
      } else {
        this.showing_details = true;
        this.showDetails();
        return this.showOpenedDisclosure();
      }
    };

    ProgressDisclosure.prototype.showOpenedDisclosure = function() {
      return this.disclosure_elem.update('▶');
    };

    ProgressDisclosure.prototype.showClosedDisclosure = function() {
      return this.disclosure_elem.update('▼');
    };

    ProgressDisclosure.prototype.showDetails = function() {
      return this.details_elms.each(function(elm) {
        return elm.hide();
      });
    };

    ProgressDisclosure.prototype.hideDetails = function() {
      return this.details_elms.each(function(elm) {
        return elm.show();
      });
    };

    return ProgressDisclosure;

  })();

  document.observe("dom:loaded", function() {
    return $$(".disclosure_widget").each(function(item) {
      var reporter;
      return reporter = new ProgressDisclosure(item);
    });
  });

}).call(this);
