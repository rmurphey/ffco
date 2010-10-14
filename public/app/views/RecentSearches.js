require.def(['text!./templates/RecentSearchTerm.html'], function(tpl) {
  var searches = {
    init : function(el) {
      this.el = el;
      this.el.delegate('li', 'click', $.proxy(this, '_handleClick'));
    },

    addTerm : function(term, svcs) {
      // create a list item for the term and 
      // add it to the recent searches container
      $(Mustache.to_html(tpl, { term : term, svcs : svcs }))
        .prependTo(this.el)
        .data('svcs', svcs)
        .data('term', term);
    },

    _handleClick : function(e) {
      var target = $(e.target), svcs, term;

      // did they click on the remove button?
      if (target.is('span.remove')) {
        $(e.target).parent().remove(); 
        return;
      }

      // otherwise, let's re-search for the term
      // using the services they chose
      svcs = target.data('svcs');
      term = target.data('term');

      $.publish('/search', [ term, svcs ]);
    }
  };

  return function(el) {
    searches.init(el);
    return searches;
  };
});
