require.def(
['text!./templates/SearchInput.html'],
/**
 * Search Input module
 *
 * Returns a function that can be used to set up behavior and
 * processing for a search form. A form passed to the returned
 * function should be a jQuery object. When the form is submitted,
 * the default submit event will be prevented, and the module
 * will announce the search term and search services requested
 * by the user.
 */
function(tpl) {
  /**
   * Parses a jQuery object containing a form 
   * into an object that contains the information
   * in the form.
   * @param form {Object} jQuery object containing the form to parse
   * @returns {Object} Object with term, svcs properties
   */
  function parseForm(form) {
    var formData = form.serializeArray(),
        ret = {},
        svcs = [];
        
    $.each(formData, function(i, field) {
      if (field.name == 'q') {
        // use the q input for the term
        ret.term = field.value;
      } else {
        // build an array of services from
        // the fields with the name svc
        if (field.name == 'svc') {
          svcs.push(field.value);
        }
      }
    });
    
    ret.svcs = svcs;
    return ret;
  }

  /**
   * Function for setting up a search form to broadcast
   * the user's selections to the application.
   * @param {Object} searchForm jQuery object containing the
   * form to be enabled.
   */
  var searchFormSetup = function(searchForm, services) {
    // create a new form from the template
    // and replace the original form with it
    var newForm = $(Mustache.to_html(tpl, { services : services }));
    searchForm.replaceWith(newForm);

    newForm.submit(function(e) {
      e.preventDefault();
      
      var formData = parseForm($(this));
      
      // abort if no search term
      if (!$.trim(formData.term)) { return; }

      // abort if no services are chosen
      if (!formData.svcs.length) { return; }

      $.publish('/search', [ formData.term, formData.svcs ]);
    });
  };

  return searchFormSetup;
});
