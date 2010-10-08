require.def(['text!./templates/MessageBox.html'], function(tpl) {
  var messageBox = $(tpl).prependTo('body').hide(),
      content = messageBox.find('div.content'),
      closer = messageBox.find('p.close span'),
      messaging = {
        _before : function(type) {
          messageBox.removeClass().addClass(type); 
        },

        _show : function() {
          messageBox.slideDown(500);
          this.closed = false;
        },

        _setMessage : function(msg) {
          content.html(msg);
        },

        _close : function(wait) {
          if (this.closed) { return; }
          this.closed = true;
          messageBox.delay(wait || 0).slideUp();
        },

        info : function(msg) {
          this._before('info');
          this._setMessage(msg);
          this._show();
          this._close(3000);
        },

        error : function(msg) {
          this._before('error');
          this._setMessage(msg);
          this._show();
        },

        warning : function(msg) {
          this._before('warning');
          this._setMessage(msg);
          this._show();
          this._close(5000);
        }
      };

  closer.click($.proxy(messaging, '_close'));

  return {
    info : messaging.info,
    error : messaging.error,
    warning : messaging.warning
  };
});
