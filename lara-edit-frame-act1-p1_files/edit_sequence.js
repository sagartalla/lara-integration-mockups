(function() {
  var ThumbnailPreview;

  ThumbnailPreview = (function() {
    function ThumbnailPreview($preview, $toggle, $field) {
      this.$preview = $preview;
      this.$toggle = $toggle;
      this.$field = $field;
      this.scheduled_job = null;
      this.previous_value = null;
      this.setupEvents();
      this.updatePreview();
    }

    ThumbnailPreview.prototype.updatePreview = function() {
      return this.$preview.find("img").attr('src', this.$field.val());
    };

    ThumbnailPreview.prototype.setupEvents = function() {
      var _this = this;
      this.$toggle.click(function(e) {
        return _this.$preview.toggle();
      });
      return this.$field.change(function(e) {
        return _this.updatePreview();
      });
    };

    return ThumbnailPreview;

  })();

  $(document).ready(function() {
    window.ThumbnailPreview = ThumbnailPreview;
    return new ThumbnailPreview($("#thumbnail_preview"), $("#toggle_thumbnail_preview"), $(".thumbnail_source"));
  });

}).call(this);
