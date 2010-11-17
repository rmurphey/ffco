define(

/**
 * Base JSONP Search Service module
 *
 * NOTE that this module is not meant to be used on its own.
 * 
 * This module is intended to be used as a base for creating
 * a JSONP search service. It encapsulates the base functionality
 * of a search service, but doesn't specify any details and points at a local 
 * fixture file (/data/news.json) for the sake of testing.
 *
 * @returns {Function} factory function for creating new instances
 * of a search service with a provided config
 */
function() {
  var SearchService = {
    /**
     * The base of the URL to be queried
     */
    baseUrl : '/data/news.json',
    
    /**
     * Fetches search results from the service for the given term
     * @param {String} term The term to search for
     * @param {Function} cb A callback to run when data is returned
     */
    fetch : function(term, cb) {
      this.cache = this.cache || {};
      
      /**
       * Function for dealing with results once we have them,
       * either from the service or from the service's cache.
       * Note that this is created using $.proxy so it will always
       * run in the scope of our service instance.
       */
      var handler = $.proxy(function(resp) {
        var results = this._filterResponse(resp);
        this._handleResponse(results, term);
        if (cb && $.isFunction(cb)) {
          cb({ results : results, svc : this.name });
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
     * Stub for working with response prior to
     * passing it to other code
     */
    _filterResponse : function(resp) {
      return resp; 
    },

    /**
     * Stub for building the query string for the term
     * @param {String} term The term to search for
     * @returns {String} The query 
     * @private
     */
    _buildQuery : function(term) {
      return term;
    },

    /**
     * Handle the response when the service returns results
     * @param {Object} resp The response object from the service
     * @param {String} term The term that the response is for
     * @private
     */
    _handleResponse : function(results, term) {
      // don't cache an empty result set
      if (!results) { return; }

      // cache the results for the term
      this.cache[term] = this.cache[term] || results;
    }
  };
  
  return function(config) {
    var s = Object.create(SearchService);
    return $.extend(s, config);
  };
});