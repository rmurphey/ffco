require.def(['text!app/templates/ResultsSet.html'], function(tpl) {
  return Class.extend({
    templates : {
      'default' : tpl
    },

    init : function(data) {
      this.data = data;

      this.preprocess();
      this.createNode();
      this.setupEvents(); 

      return this;
    },

    createNode : function() {
      var tpl = this.templates[this.data.svc] || this.templates['default'];
      this.el = $(Mustache.to_html(tpl, this.data));
    },

    preprocess : function() {
      // placeholder for subclasses to alter data they get
      return this.data;
    },

    getNode : function() {
      return this.el;
    },

    setupEvents : function() {
      this.el.delegate('p.tools span', 'click', $.proxy(this, 'handleTool')); 
    },

    handleTool : function(e) {
      e.preventDefault();
      var target = $(e.currentTarget), url;

      if (target.hasClass('disabled')) { return; }
      target.addClass('disabled');

      if (target.hasClass('like')) {
        url = target.closest('li').attr('data-url');
        $.publish('/like', [ url, function() { $.publish('/msg/info', [ 'You liked ' + url ]); } ]);    
      }
    }
  });
});
