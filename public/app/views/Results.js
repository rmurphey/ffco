require.def(['text!./templates/Results.html'], function(resultsTpl) {
  var Results = {
    // default container
    container : $('<ul/>'),

    clear : function() {
      this.container.empty();
    },

    addResults : function(data) {
      if (!data.results.length) { return; }
      
      $('<li/>')
        .appendTo(this.container)
        .append(Mustache.to_html(resultsTpl, data))
        .delegate('ul.resultTools li', 'click', $.proxy(this, '_handleTools'));
    },
    
    _handleTools : function(e) {
      var tool = $(e.target),
          type = tool.attr('data-toolType'),
          url = tool.closest('li.result').attr('data-url');
      
      $.publish('/result/' + type, [ url ]);

      tool.addClass('selected').siblings().removeClass('selected');
    }
  };

  return function(config) {
    var r = Object.create(Results);

    if (config.container) {
      r.container = config.container;
    }

    return r;
  };
});
