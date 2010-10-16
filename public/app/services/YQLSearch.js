require.def(

['/app/services/_SearchService'], 

/**
 * Search Service module
 *
 * Returns a function that can be used to create a new instance
 * of a search service using the Service prototype.
 */
function(createSearchService) {

  // prototype for creating new services
  var services = {},
      YQLSearch = createSearchService({
        /**
         * Base URL for all requests
         */
        baseUrl : 'http://query.yahooapis.com/v1/public/yql?callback=?',

        /**
         * Default fields to fetch from the service.
         */
        fields : [ 'title', 'abstract', 'url' ],

        /**
         * Deal with YQL-type results
         */
        _filterResponse : function(resp) {
          return resp.query.results.result;
        },
        
        /**
         * Build a YQL-type query string for the term
         * @param {String} term The term to search for
         * @returns {String} The query 
         * @private
         */
        _buildQuery : function(term) {
          return 'select ' + 
            this.fields.join(',') + 
            ' from ' + this.name + 
            ' where query="' + term + '"';
        }
      });
      
  /**
   * Create a new service and optionally override the default fields
   * @param {Object} config Overrides for the service instance. Note that
   * the name property is required to be present.
   */
  return function(config) {
    if (!config.name) { return false; }

    // if a service with this name already exists, return it
    if (services[config.name]) { return services[config.name]; }
    
    var s = services[config.name] = Object.create(YQLSearch);
    s.name = config.name;
    if (config.fields) { s.fields = config.fields; }
    return s;
  };
});
