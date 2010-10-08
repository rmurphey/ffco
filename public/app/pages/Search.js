/**
 * Search page
 */
require.def(
  
  // components required for the page
  [
    '../views/SearchInput',
    '../views/Results', 
    '../services/Search'
  ], 

  // page setup 
  function(searchInputSetup, resultsViewSetup, searcherSetup) {
    var resultsView = resultsViewSetup({ container : $('#results') }),
        searchInput = searchInputSetup($('#search')),
        searchers = $.map(
          [
            // a list of the YQL services we want to enable
            'search.web', 
            'search.news' 
          ], 
          function(svcName) { return searcherSetup({ name : svcName }); }
        );

    // when the user searches for a term ...
    $.subscribe('/search', function(term) {
      // clear the results area first
      resultsView.clear();

      // then tell each searcher to fetch results
      $.each(searchers, function(i, searcher) {
        // when results come in, add them to the results view
        searcher.fetch('term', function(res) {
          resultsView.addResults(res);
        });
      });
    });
  }
);
