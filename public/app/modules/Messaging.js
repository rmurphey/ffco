require.def(function() {
  var messageBox = $('<div id="messageBox"/>').prependTo('body').hide();

  var messenger = {
    _prep : function(type) {
      messageBox.unbind('click');
      messageBox.empty().removeClass().addClass(type);
    },

    _post : function(wait) {
      messageBox.delay(wait || 0).slideUp();
    },

    info : function(msg) {
      this._prep('info');
      messageBox.html(msg).slideDown();
      this._post(5000);
    },

    error : function(msg) {
      this._prep('error');
      messageBox.html(msg + ' (click to dismiss)').slideDown(200);
      messageBox.bind('click', $.proxy(this, '_post'));
    },

    warning : function(msg) {
      this._prep('warning');
      messageBox.html(msg).slideDown(500);
      this._post(5000);
    }
  };

  $.subscribe('/msg/info', $.proxy(messenger, 'info'));
  $.subscribe('/msg/error', $.proxy(messenger, 'error'));
  $.subscribe('/msg/warning', $.proxy(messenger, 'warning'));
});
