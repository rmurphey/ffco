/**
 * Search page
 */
require.def(
  
  // components required for the page
  [
    '../views/SearchInput',
    '../views/Results', 
    '../services/Search',
    '../services/ResultsTools'
  ], 

  // page setup 
  function(searchInputSetup, resultsViewSetup, searcherSetup, resultsTools) {
    var resultsView = resultsViewSetup({ container : $('#results') }),
        searchInput = searchInputSetup($('#search')),
        searchers = {};

    // when the user searches for a term ...
    $.subscribe('/search', function(term, svcs) {
      // clear the results area first
      resultsView.clear();

      // check to see if any services were indicated
      if (!svcs.length) { return; }

      // check to see if a search term was provided
      if (!$.trim(term)) { return; }

      // for each requested service ...
      $.each(svcs, function(i, svc) {
        // create a searcher for the service
        // if one doesn't already exist
        if (!searchers[svc]) {
          searchers[svc] = searcherSetup({ name : svc });
        }

        // fetch results from the searcher
        searchers[svc].fetch(term, function(results) {
          resultsView.addResults(results);
        });
      });
    });
    
    // listen for heart, hate messages so we
    // can handle them accordingly
    $.each(['heart', 'hate'], function(i, tool) {
      $.subscribe('/result/' + tool, function(url) {
        resultsTools.handle(tool, url);
      });
    });
  }
);
