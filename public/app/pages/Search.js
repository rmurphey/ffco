require.def(
  [
    '../views/SearchInput',
    '../views/Results', 
    '../views/RecentSearches',
    '../services/Search',
    '../services/Results'
  ], 

  /**
   * Search Page module
   *
   * Search page setup and topic subscriptions.
   */
  function(searchInputSetup, resultsViewSetup, recentSearchesSetup, searchServiceSetup, resultsService) {
    
    var resultsView = resultsViewSetup($('#results')),
        recentSearchesView = recentSearchesSetup($('#searches')),

        searchServiceConfig = [
          { name : 'search.web', displayName : 'web' },
          { name : 'search.news', displayName : 'news' }
        ],

        searchServices = {};

    searchInputSetup($('#search'), searchServiceConfig);

    // when the user searches for a term ...
    $.subscribe('/search', function(term, svcs) {
      
      // clear the results area first
      resultsView.clear();

      // check to see if any services were indicated
      if (!svcs.length) { return; }

      // check to see if a search term was provided
      if (!$.trim(term)) { return; }

      // add the term to recent searches
      recentSearchesView.addTerm(term, svcs);

      // for each requested service ...
      $.each(svcs, function(i, svc) {
        // create a searcher for the service
        // if one doesn't already exist
        if (!searchServices[svc]) {
          searchServices[svc] = searchServiceSetup({ name : svc });
        }

        // fetch results from the searcher
        searchServices[svc].fetch(term, function(results) {
          // pass the results to the results view
          // once the searcher responds
          resultsView.addResults(results);
        });
      });
    });
    
    // listen for result-related messages so we can pass them
    // to the resultsService accordingly
    $.each(resultsView.toolTypes, function(i, tool) {
      $.subscribe('/result/' + tool, function(url) {
        resultsService.handleTool(tool, url);
        $.publish('/msg/info', [ 'You ' + tool + ' ' + url ]);
      });
    });
  }
);
