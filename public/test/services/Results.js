require(['/app/services/Results'], function(results) {

module('Results Service');

test('Results data can be set and then retrieved', function() {
  expect(1);

  results.handleTool('testTool', 'http://foo.com');
  equals(
    results.getUrlData('http://foo.com').type, 
    'testTool', 
    'Proper data is returned when set'
  );
});

});
