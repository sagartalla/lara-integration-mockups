(function() {
  var Anonymizer, trim;

  trim = function(string) {
    return string.replace(/^\s+|\s+$/g, '');
  };

  Anonymizer = (function() {

    function Anonymizer() {
      var _this = this;
      this.selector = ".learner_response_name";
      this.alt_selector = "div.user";
      this.button_select = "anonymize_button";
      this.real_to_fake_map = {};
      this.fake_to_real_map = {};
      this.counter = 0;
      this.anonymous = false;
      if ($(this.button_select)) {
        $(this.button_select).observe('click', function(evt) {
          _this.toggle();
          return evt.stop();
        });
      }
    }

    Anonymizer.prototype.record_fake_and_real = function(real_name) {
      var fake;
      fake = this.real_to_fake_map[real_name];
      if (!fake) {
        fake = "Student " + this.counter;
        this.counter++;
        this.real_to_fake_map[real_name] = fake;
        this.fake_to_real_map[fake] = real_name;
      }
      return fake;
    };

    Anonymizer.prototype.rename_button = function() {
      if (this.anonymous) {
        return $(this.button_select).textContent = "Show names";
      } else {
        return $(this.button_select).textContent = "Hide names";
      }
    };

    Anonymizer.prototype.publicize = function() {
      var _this = this;
      this.anonymous = false;
      $$(this.selector).each(function(item) {
        var fake_name;
        fake_name = trim(item.textContent);
        return item.textContent = _this.fake_to_real_map[fake_name];
      });
      return $$(this.alt_selector).each(function(item) {
        var fake_name;
        fake_name = trim(item.textContent);
        return item.textContent = _this.fake_to_real_map[fake_name];
      });
    };

    Anonymizer.prototype.anonymize = function() {
      var _this = this;
      this.anonymous = true;
      $$(this.selector).each(function(item) {
        var real_name;
        real_name = trim(item.textContent);
        return item.textContent = _this.record_fake_and_real(real_name);
      });
      return $$(this.alt_selector).each(function(item) {
        var real_name;
        real_name = trim(item.textContent);
        return item.textContent = _this.real_to_fake_map[real_name];
      });
    };

    Anonymizer.prototype.toggle = function() {
      if (this.anonymous) {
        this.publicize();
      } else {
        this.anonymize();
      }
      return this.rename_button();
    };

    return Anonymizer;

  })();

  document.observe("dom:loaded", function() {
    var a;
    return a = new Anonymizer;
  });

}).call(this);
