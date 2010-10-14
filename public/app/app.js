require.def(['./views/Messaging'], function(messaging) {
  return function() {
    // app-wide functionality
    $.subscribe('/msg/info', $.proxy(messaging, 'info'));
    $.subscribe('/msg/error', $.proxy(messaging, 'error'));
    $.subscribe('/msg/warning', $.proxy(messaging, 'warning'));

    // per-page functionality
    require(['/app/pages/' + $('body').attr('data-page')], function(pageFn) { 
      // if a page module returns a function, run it
      pageFn && $.isFunction(pageFn) && pageFn(); 
    });
  };
});
