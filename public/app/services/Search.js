require.def(function() {
  var Service = function(config) {
    this.name = config.name;
    this.fields = config.fields || [ 'title', 'url', 'abstract' ];

    $.subscribe('/search', $.proxy(this, 'fetch'));

    return this;
  };

  Service.prototype = {
    cache : {},

    baseUrl : 'http://query.yahooapis.com/v1/public/yql?callback=?', 

    fetch : function(term) {
      this.term = term;

      if (this.cache[term]) {
        this.handleResponse(term);
      } else {
        $.getJSON(
          this.baseUrl, 
          { q : this.buildQuery(term), format : 'json' }, 
          $.proxy(this, 'handleResponse')
        ); 
      }
    },

    buildQuery : function(term) {
      return 'select ' + this.fields.join(',') + ' from ' + this.name + ' where query="' + term + '"';
    },

    handleResponse : function(resp) {
      if (!resp.query.results.result) { 
        return; 
      }

      this.cache[this.term] = this.cache[this.term] || resp;

      $.publish('/results', [{ 
        results : resp.query.results.result, 
        svc : this.name,
        fields : this.fields
      }]);
    }
  };

  return Service;
});
