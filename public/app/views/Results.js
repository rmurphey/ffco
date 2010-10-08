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
        .append(Mustache.to_html(resultsTpl, data));
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
