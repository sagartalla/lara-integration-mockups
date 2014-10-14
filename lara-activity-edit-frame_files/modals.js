(function() {
  $(function() {
    var $modal, $modal_close, $modal_container;
    $modal = $('#modal');
    $modal_close = $modal.find('.close');
    $modal_container = $('#modal-container');
    $(document).on('ajax:success', 'a[data-remote]', function(xhr, data, status) {
      $modal.html(data.html).prepend($modal_close).css('top', $(window).scrollTop() + 40).show();
      $modal_container.show();
      return addModalClickHandlers();
    });
    return $(document).on('click', '#modal .close', function() {
      $modal_container.hide();
      $modal.hide();
      return false;
    });
  });

}).call(this);
