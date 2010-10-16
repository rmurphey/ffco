require.def(
  // dependencies
  [
    '../views/SearchInput',
    '../views/Results', 
    '../views/RecentSearches',
    '../services/YQLSearch',
    '../services/Results'
  ], 

  /**
   * Search Page mediator
   *
   * This module sets up the services and views for the search page,
   * then handles communication between the views and services.
   */
  function(
    searchInputSetup, 
    resultsViewSetup, 
    recentSearchesSetup, 
    searchServiceSetup, 
    resultsServiceSetup
  ) {
    
    /**
     * First, create the views and services for the page
     *
     * (we'll hold off on creating the search services until
     * they're actualy needed)
     */
    var resultsView = resultsViewSetup($('#results')),
        recentSearchesView = recentSearchesSetup($('#searches')),
        resultsService = resultsServiceSetup(),
        
        searchServices = {};

    searchInputSetup($('#search'), [
      // the services that the search input will provide
      { name : 'search.web', displayName : 'web' },
      { name : 'search.news', displayName : 'news' }
    ]);
    
    /**
     * Then, define the topics we want our mediator 
     * to listen for, and how it should react when it 
     * "hears" them.
     */
    var subscriptions = {
      '/search' : function(term, svcs) {
        resultsView.clear();
        recentSearchesView.addTerm(term, svcs);

        $.each(svcs, function(i, svc) {
          if (!searchServices[svc]) {
            searchServices[svc] = searchServiceSetup({ name : svc });
          }

          searchServices[svc].fetch(term, function(results) {
            resultsView.addResults(results);
          });
        });
      }
    };

    // add listeners for result tools to subscriptions
    // based on the list of tools provided by the results view
    $.each(resultsView.toolTypes, function(i, tool) {
      subscriptions['/result/' + tool] = function(url) {
        resultsService.handleTool(tool, url);
        $.publish('/msg/info', [ 'You ' + tool + ' ' + url ]);
      };
    });

    /**
     * Set up subscriptions
     */
    $.each(subscriptions, function(topic, fn) {
      $.subscribe(topic, fn);
    });
  }
);
