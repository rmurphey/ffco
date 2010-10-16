require(['/app/services/Results'], function(resultsSetup) {

var resultsService;

module('Results Service', { 
  setup : function() {
    resultsService = resultsSetup();
  }
});

test('Results data can be set and then retrieved', function() {
  expect(1);

  resultsService.handleTool('testTool', 'http://foo.com');
  equals(
    resultsService.getUrlData('http://foo.com').type, 
    'testTool', 
    'Proper data is returned when set'
  );
});

});
