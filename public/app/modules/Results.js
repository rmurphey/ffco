require.def(['./ResultsSet'], function(ResultsSet) {
  var ResultsView = function(config) {
    this.container = config.container;

    $.subscribe('/search', $.proxy(this, 'clear'));
    $.subscribe('/results', $.proxy(this, 'handleResults')); 

    return this;
  };

  ResultsView.prototype = {
    clear : function() {
      this.container.empty();
    },

    handleResults : function(data) {
      var resultSet = new ResultsSet(data);
      this.container.append(resultSet.getNode());
    }
  };

  return ResultsView;
});
