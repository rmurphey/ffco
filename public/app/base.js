(function($){

var resultsContainer = $('#results'),
    resultsTpl = '<h2><a href="{url}">{title}</a></h2><p>{abstract}</p>',
    searchUrl = window.INTERNET ? 
      'http://query.yahooapis.com/v1/public/yql?callback=?' :
      '/data/news.json';

$('#search').submit(function(e) {
  e.preventDefault();
  resultsContainer.empty();

  var term = $(this).find('input').val();

  $.getJSON(searchUrl, { q : term, format : 'json' }, function(resp) {
    resultsContainer.html(
      $.map(resp.query.results.result, function(r) {
        return resultsTpl
          .replace('{url}', r.url)
          .replace('{title}', r.title)
          .replace('{abstract}', r.abstract || '(No abstract)');
      }).join('')
    );
  });
});

})(jQuery);
