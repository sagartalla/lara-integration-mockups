(function() {
  var modalDialog;

  modalDialog = function(correct, feedback) {
    var dialogClass, title;
    if (correct) {
      title = "Correct";
      dialogClass = "correct";
      feedback || (feedback = "Yes! You are correct.");
    } else {
      title = "Incorrect";
      dialogClass = "incorrect";
      feedback || (feedback = "Sorry, that is incorrect.");
    }
    $('#modal-dialog').html("<div class='check-answer'><p class='response'>" + feedback + "</p></div");
    return $('#modal-dialog').dialog({
      title: title,
      modal: true,
      dialogClass: dialogClass
    });
  };

  window.modalDialog = modalDialog;

}).call(this);
