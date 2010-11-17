define(

// template dependency
['text!/app/views/templates/SearchInput.html'],

/**
 * Search Input module
 *
 * Returns a function that can be used to set up behavior and
 * processing for a search form. A form passed to the returned
 * function should be a jQuery object. When the form is submitted,
 * the default submit event will be prevented, and the module
 * will announce the search term and search services requested
 * by the user. If the user does not enter a term or does not 
 * choose at least one service, no message will be broadcast.
 */
function(tpl) {
  /**
   * Sets up a search form so it will broadcast
   * the user's selections to the application.
   *
   * @param {Object} searchForm jQuery object containing the
   * form to be enabled.
   * @param {Array} services A list of the services that the
   * form should offer. Each service should have a "name"
   * and a "displayName" property.
   */
  var searchFormSetup = function(searchForm, services) {
    var newForm = $(Mustache.to_html(tpl, { services : services }));
    searchForm.replaceWith(newForm);
    newForm.submit(handleFormSubmit);
  };

  /**
   * Responds to form submission and checks form data
   * to see whether the search should be announced to
   * the rest of the application
   *
   * @param {Object} e Event object
   */
  function handleFormSubmit(e) {
      var formData = parseForm($(this));
      
      if (!$.trim(formData.term)) { return; }
      if (!formData.svcs.length) { return; }

      $.publish('/search', [ formData.term, formData.svcs ]);
      e.preventDefault();
  }

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

  return searchFormSetup;
});
