require.def(['./modules/Results', './services/Search'], function(Results, Service) {
  return {
    init : function() {
      $('#search').submit(function(e) {
        e.preventDefault();
        $.publish('/search', [ $(this).find('input').val() ]);
      });

      new Results({ container : $('#results') });
      new Service({ name : 'search.web' });
      new Service({ name : 'search.news' });
    }
  };
});
