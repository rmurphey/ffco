(function($){

var resultsContainer = $('#results'),
    resultsTpl = '<li><h2><a href="{url}">{title}</a></h2><p>{abstract}</p><p class="tools"><span class="like">like</span></p></li>',
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

resultsContainer.delegate('p.tools span', 'click', function(e) {
  var tool = $(this), url;

  if (tool.hasClass('disabled')) { return; }
  tool.addClass('disabled');
      
  url = tool.closest('li').find('h2 a').attr('href');

  $.post('/like', { url : url }, function() {
    alert('Like logged!');
  });
});

})(jQuery);
