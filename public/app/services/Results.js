require.def(
/**
 * Results API module
 *
 * Returns an object that exposes an API for working with results
 * and getting information about results by their URL
 */
function(){

  /**
   * Closed (private) variable to contain data about results by URL
   */
  var selections = {};

  return {
    /**
     * Handles a tool being used on a given result. Currently
     * assumes that a result can only have one tool type
     * selected at a time.
     * @param {String} type The type of tool used
     * @param {String} url The url of the result on which the tool was used
     */
    handleTool : function(type, url) {
      selections[url] = { type : type };
      this._sendSelection(type, url);
    },

    /**
     * Sends selection to the server
     * @param {String} type The type of tool used
     * @param {String} url The url of the result on which the tool was used
     */
    _sendSelection : function(type, url) {
      console.log('Pretend we sent a POST about how we ' + type + ' ' + url);
    },

    /**
     * Provides data stored by the results API for a given URL
     * @param {String} url The url to get information about
     * @returns {Object} Object containing data about the URL,
     * or an empty object if there is no information about the URL
     */
    getUrlData : function(url) {
      return selections[url] || {};
    }
  };
});
