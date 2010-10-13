require.def(function() {
  return function(searchForm) {
    function parseForm(form) {
      var formData = form.serializeArray(),
          ret = {},
          svcs = [];
          
      $.each(formData, function(i, field) {
        if (field.name == 'q') {
          ret.term = field.value;
        } else {
          if (field.name == 'svc') {
            svcs.push(field.value);
          }
        }
      });
      
      ret.svcs = svcs;
      return ret;
    }
    
    searchForm.submit(function(e) {
      e.preventDefault();
      
      var formData = parseForm($(this));
      
      if (!$.trim(formData.term)) { return; }
      if (!formData.svcs.length) { return; }

      $.publish('/search', [ formData.term, formData.svcs ]);
    });
  };
});
