define(
// results set template
['text!/app/views/templates/Results.html'], 

/**
 * Results View module
 *
 * Sets up a container for viewing results, and provides an API for 
 * interacting with the container.
 *
 * @returns {Function} Function for setting up a container as a results view
 *
 * @param {String} resultsTpl Template provided by RequireJS
 */
function(resultsTpl) {

  /**
   * API for results view
   */
  var results = {
    /**
     * Types of tools each result will have. Tools are mutually exclusive
     */
    toolTypes : [ 'heart', 'hate' ],

    /**
     * Clear the results view
     */
    clear : function() {
      this.container.empty();
    },

    /**
     * Add results to the view
     * @param {Object} data This object must have two properties: results and
     * svc. Results should be an array of results; svc should be the name of
     * the service for display purposes.
     */
    addResults : function(data) {
      // don't bother if there are no results in the set
      if (!data.results.length) { return; }

      $.extend(data, { toolTypes : this.toolTypes });
      
      // create a list item for the results set
      $('<li/>')
        .appendTo(this.container)

        // add the individual results to it
        .append(Mustache.to_html(resultsTpl, data))

        // handle clicks on result tools buttons
        .delegate('ul.resultTools li', 'click', $.proxy(this, '_handleTools'));
    },
    
    /**
     * Handle a click on the tools for a given result
     * @param {Object} e Event object
     */
    _handleTools : function(e) {
      var tool = $(e.target),
          type = tool.attr('data-toolType'),
          url = tool.closest('li.result').attr('data-url');
      
      // mark the tool as selected and siblings unselected
      // (assumes tools are mutually exclusive)
      tool.addClass('selected').siblings().removeClass('selected');
      
      // announce the tool interaction so the 
      // application can deal with it
      $.publish('/result/' + type, [ url ]);
    }
  };

  /**
   * Initialize the results view API for the given container
   * and return an API object for interacting with the view.
   */
  var resultsViewSetup = function(container) {
    if (!container) { return false; }
    results.container = container; 

    var ret = {
      clear : $.proxy(results, 'clear'),
      addResults : $.proxy(results, 'addResults'),
      toolTypes : results.toolTypes
    };

    // make sure we return the same thing if 
    // this setup is called again
    resultsViewSetup = function() { return ret; };

    return ret;
  };

  // return the setup function as the module definition
  return resultsViewSetup;
});
