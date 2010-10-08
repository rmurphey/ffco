require.def(function() {
  return function(searchForm) {
    searchForm.submit(function(e) {
      e.preventDefault();
      var val = $.trim($(this).find('input').val());
      if (!$.trim(val)) { return; }
      $.publish('/search', [ val ]);
    });
  };
});
