require.def(

// app-wide dependencies
['/app/views/Messaging'], 

/**
 * Sets up application-wide functionality, then figures out
 * which page we're on based on the body element's data-page
 * attribute, and loads the appropriate page functionality.
 *
 * @returns {Function} Application init function
 */
function(messaging) {
  return function() {
    // app-wide messaging functionality
    $.each(messaging, function(type) {
      $.subscribe('/msg/' + type, messaging[type]);
    });

    // load per-page functionality
    require(['/app/pages/' + $('body').attr('data-page')]);
  };
}

);
