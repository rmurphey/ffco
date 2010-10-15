require.def(
/**
 * Messaging module
 *
 * Returns an API for application-wide messaging. This API is intended to be included
 * in the application, and then connected to via topic subscription.
 */

  // messaging template
  ['text!/app/views/templates/MessageBox.html'], 
  
  function(tpl) {

  /**
   * Initialization for messaging functionality
   */
  var messageBox = $(tpl).prependTo('body').hide(),
      content = messageBox.find('div.content'),
      closer = messageBox.find('p.close span'),

      /**
       * Closed (private) messaging object
       */
      messaging = {
        /**
         * Things to do before a message is shown
         * @param {String} type The type of message that will be shown
         */
        _before : function(type) {
          messageBox.removeClass().addClass(type); 
        },

        /**
         * Shows the message
         */
        _show : function() {
          messageBox.slideDown(500);
          this.closed = false;
        },

        /**
         * Sets the content of the message box
         * @param {String} msg The message to use
         */
        _setMessage : function(msg) {
          content.html(msg);
        },

        /**
         * Closes the message, with an optional delay
         * @param {Integer} wait The time in milliseconds to wait 
         * before closing the message. 
         */
        _close : function(wait) {
          if (this.closed) { return; }
          this.closed = true;
          messageBox.delay(wait || 0).slideUp();
        },

        /**
         * Show a message of type 'info'
         * @param {String} msg The message to show
         */
        info : function(msg) {
          this._before('info');
          this._setMessage(msg);
          this._show();
          this._close(3000);
        },

        /**
         * Show a message of type 'error'
         * @param {String} msg The message to show
         */
        error : function(msg) {
          this._before('error');
          this._setMessage(msg);
          this._show();
        },

        /**
         * Show a message of type 'warning'
         * @param {String} msg The message to show
         */
        warning : function(msg) {
          this._before('warning');
          this._setMessage(msg);
          this._show();
          this._close(5000);
        }
      };

  // make the message close when the close button is clicked
  closer.click($.proxy(messaging, '_close'));

  /**
   * The public messaging API
   */
  return {
    info : $.proxy(messaging, 'info'),
    error : $.proxy(messaging, 'error'),
    warning : $.proxy(messaging, 'warning')
  };
});
