(function($){

var resultsContainer = $('#results'),
    resultsTpl = '<li><h2><a href="{url}">{title}</a></h2><p>{abstract}</p>' + 
      '<p class="tools"><span class="like">like</span></p></li>',
    searchUrl = 'http://query.yahooapis.com/v1/public/yql?callback=?',
    messageBox = $('<div id="messageBox"><p class="close"><span>Close</span></p><div class="content"></div></div>')
      .prependTo('body').hide(),
    messageBoxContent = messageBox.find('div.content');

function buildQuery(term, svc, fields) {
  return 'select title,abstract,url from ' + svc + ' where query=' + term;
}

function infoMessage(msg) {
  messageBoxContent.html(msg)
  messageBox.slideDown().delay(5000).slideUp();
}

$('#search').submit(function(e) {
  e.preventDefault();
  resultsContainer.empty();

  var term = $(this).find('input').val();

  $.each(['search.news', 'search.web'], function(i, svcName) {
    $.getJSON(
      searchUrl, 
      { q : buildQuery(term, svcName), format : 'json' }, 
      function(resp) {
        $('<li><h3>' + svcName + '</h3><ul></ul></li>')
          .appendTo(resultsContainer)
          .find('ul')
          .html(
            $.map(resp.query.results.result, function(r) {
              return resultsTpl
                .replace('{url}', r.url)
                .replace('{title}', r.title)
                .replace('{abstract}', r.abstract || '(No abstract)');
            }).join('')
          );
      }
    );
  });
});

resultsContainer.delegate('p.tools span', 'click', function(e) {
  var tool = $(this), url;

  if (tool.hasClass('disabled')) { return; }
  tool.addClass('disabled');
      
  url = tool.closest('li').find('h2 a').attr('href');

  $.post('/like', { url : url }, function() {
    infoMessage('You liked ' + url);
  });
});

})(jQuery);
