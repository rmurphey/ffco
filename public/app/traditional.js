$(document).ready(function() {
  // initialize variables we'll need repeatedly
  var resultsContainer = $('#results'),
      resultsTpl = '<li><h2><a href="{{url}}">{{title}}</a></h2><p>{{abstract}}</p>' + 
        '<p class="tools"><span class="like">like</span></p></li>',
      searchUrl = 'http://query.yahooapis.com/v1/public/yql?callback=?',
      buildQuery = function(term, svc) {
        return 'select title,abstract,url from ' + svc + ' where query=' + term;
      };

  // when the user submits the search form, intercept it
  $('#search').submit(function(e) {
    e.preventDefault();
    resultsContainer.empty();

    // get the search term and make sure it's non-empty
    var term = $(this).find('input').val();
    if (!$.trim(term)) { return; }

    // fetch results
    $.each(['search.news', 'search.web'], function(i, svcName) {
      $.getJSON(
        searchUrl, 
        { q : buildQuery(term, svcName), format : 'json' }, 

        // populate the results container 
        function(resp) {
          $('<li><h3>' + svcName + '</h3><ul></ul></li>')
            .appendTo(resultsContainer)
            .find('ul')
            .html(
              $.map(resp.query.results.result, function(r) {
                return Mustache.to_html(resultsTpl, r);
              }).join('')
            );
        }
      );
    });
  });
});