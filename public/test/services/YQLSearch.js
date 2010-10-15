require(['/app/services/YQLSearch'], function(YQLSearchSetup) {

var svc,
    fields = [ 'title', 'url' ],
    name = 'search.web';

module('YQL Search Service', {
  setup : function() {
    svc = YQLSearchSetup({
      name : name,
      fields : fields
    });
  }
});

test('Service is set up with proper properties', function() {
  expect(2);
  
  equals(svc.name, 'search.web', 'Service name is set properly');
  same(svc.fields, [ 'title', 'url' ], 'Servie fields are set properly');
});

test('Service queries properly', function() {
  expect(1);
  
  equals(
    svc._buildQuery('term'),
    'select title,url from search.web where query="term"',
    'Query is built properly'
  );
});

test('Service processes results properly', function() {
  expect(1);
  
  var result = svc._filterResponse({
    query : {
      results : {
        result : [ 'a', 'b', 'c' ]
      }
    }
  });
  
  equals(result[0], 'a', 'Response is filtered down to just results');
});

});