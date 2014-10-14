(function() {
  var LoginMenu, root;

  LoginMenu = (function() {
    function LoginMenu(trigger) {
      this.trigger = trigger != null ? trigger : $('.login_portal_widget_toggle');
      this.trigger = $('.login_portal_widget_toggle');
      this.menu = $('.login_portals_widget');
      this.register_handlers();
    }

    LoginMenu.prototype.position_menu = function() {
      var margin, o, parent, po;
      o = this.trigger.offset();
      parent = this.trigger.parent().parent();
      po = parent.offset();
      margin = 12;
      return this.menu.offset({
        top: o.top + this.trigger.height() + margin,
        left: o.left
      });
    };

    LoginMenu.prototype.register_handlers = function() {
      var _this = this;
      this.trigger.click(function(e) {
        _this.menu.toggle();
        _this.position_menu();
        return e.stopPropagation();
      });
      $('body').click(function() {
        return _this.menu.hide();
      });
      return $(window).resize(function() {
        return _this.position_menu();
      });
    };

    return LoginMenu;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.LoginMenu = LoginMenu;

  $('document').ready(function() {
    return root.login_menu = new LoginMenu();
  });

}).call(this);
