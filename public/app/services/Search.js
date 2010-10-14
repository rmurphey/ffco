require.def(function() {
/**
 * Search Service module
 *
 * Returns a function that can be used to create a new instance
 * of a search service using the Service prototype.
 */

  // prototype for creating new services
  var services = {},
  Service = {
    /**
     * Default fields to fetch from the service.
     */
    fields : [ 'title', 'abstract', 'url' ],

    /**
     * Base URL for all requests
     */
    baseUrl : 'http://query.yahooapis.com/v1/public/yql?callback=?', 

    /**
     * Cache for search results
     */
    cache : {},

    /**
     * Fetches search results from the service for the given term
     * @param {String} term The term to search for
     * @param {Function} cb A callback to run when data is returned
     */
    fetch : function(term, cb) {
      /**
       * Function for dealing with results once we have them,
       * either from the service or from the service's cache.
       * Note that this is created using $.proxy so it will always
       * run in the scope of our service instance.
       */
      var handler = $.proxy(function(resp) {
        this._handleResponse(resp, term);
        if (cb && $.isFunction(cb)) {
          cb({ results : resp.query.results.result, svc : this.name });
        }
      }, this);

      // Do the actual fetching, either from the cache
      // or from the search service.
      if (this.cache[term]) {
        // use cached results if they exist
        handler(this.cache[term]);
      } else {
        // otherwise, fetch the results
        $.getJSON(
          this.baseUrl, 
          { q : this._buildQuery(term), format : 'json' }, 
          handler
        ); 
      }
    },

    /**
     * Build the query string for the term
     * @param {String} term The term to search for
     * @private
     */
    _buildQuery : function(term) {
      return 'select ' + this.fields.join(',') + ' from ' + this.name + ' where query="' + term + '"';
    },

    /**
     * Handle the response when the service returns results
     * @param {Object} resp The response object from the service
     * @param {String} term The term that the response is for
     * @private
     */
    _handleResponse : function(resp, term) {
      // don't cache an empty result set
      if (!resp.query.results.result) { return; }

      // cache the results for the term
      this.cache[term] = this.cache[term] || resp;
    }
  },

  /**
   * Create a new service and optionally override the default fields
   * @param {Object} config Overrides for the service instance. Note that
   * the name property is required to be present.
   */
  factory = function(config) {
    if (!config.name) { return false; }

    // if a service with this name already exists, return it
    if (services[config.name]) { return services[config.name]; }
    
    var s = services[config.name] = Object.create(Service);
    s.name = config.name;
    if (config.fields) { s.fields = config.fields; }
    return s;
  };

  // return the factory function as the module definition
  return factory;
});
