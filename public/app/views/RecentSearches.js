require.def(
/**
 * Recent Searches module
 *
 * Returns a function that initializes a recent searches container
 * and then returns a limited API to that container.
 */

  // template for search terms
['text!/app/views/templates/RecentSearchTerm.html'], 

function(tpl) {
  /**
   * Closed (private) API for recent searches functionality
   */
  var searches = {

    /**
     * Object for keeping track of which terms we're showing
     */
    terms : {},

    /**
     * Initializes the recent searches API for the provided element
     * @param {Object} el The container element for recent searches. 
     * Should be a jQuery object containing a single ul.
     */
    init : function(el) {
      this.el = el.eq(0); // ensure we only get one container
      this.el.delegate('li', 'click', $.proxy(this, '_handleClick'));
    },

    /**
     * Add a term to the recent searches list
     * @private
     * @param {String} term The term to add
     * @param {Array} svcs Services that were requested for the term
     */
    addTerm : function(term, svcs) {
      // if this term was already in the list, remove it;
      // TODO: ideally, this would check to see whether it's already
      // in the list *with the same services*, and then do
      // nothing, but we're going to be lazy for now
      if (this.terms[term]) {
        this.terms[term].remove();
      }

      // create a new list item for the search term/services
      this.terms[term] = $(Mustache.to_html(tpl, { term : term, svcs : svcs }))
        .prependTo(this.el)
        .data('svcs', svcs)
        .data('term', term);
    },

    /**
     * Handle clicks on recent search list items
     * Note that this handles both remove and re-search clicks
     * @private
     * @param {Object} e The event object
     */
    _handleClick : function(e) {
      var target = $(e.target), 
          term, svcs, li;

      // did they click on the remove button?
      if (target.is('span.remove')) {
        // if so, un-cache the element and
        // remove the list item from the list
        li = target.parent();
        delete this.terms[li.data('term')];
        li.remove();
        return;
      }

      // otherwise, let's re-search for the term
      // using the services they originally chose
      svcs = target.data('svcs');
      $.publish('/search', [ term, svcs ]);
    }
  };

  /**
   * Sets up recent searches API for a given container
   * @param {Object} el A jQuery object containing the container
   * @returns {Object} An API for interacting with the recent searches
   */
  var recentSearchesSetup = function(el) {
    searches.init(el);

    var ret = {
      addTerm : $.proxy(searches, 'addTerm')
    };

    // make sure this will return the same thing
    // if it is called again
    recentSearchesSetup = function() { return ret; };

    // return the API
    return ret;
  };

  // return the setup function as the module definition
  return recentSearchesSetup;
});
