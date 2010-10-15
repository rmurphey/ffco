require(['/app/views/SearchInput'], function(searchInputSetup) {
  var data, term, done, myForm;

  module('Search Input', {
    setup : function() {
      this.pubsub = $.subscribe('/search', $.proxy(function(t, d) {
        term = t;
        data = d;
        done = true;
      }, this));

      searchInputSetup(
        $('<form/>').appendTo('body'), 
        [
          { name : 'a', displayName : 'a' },
          { name : 'b', displayName : 'b' }
        ]
      );

      myForm = $('form').eq(0);
      myForm.find('input:checkbox').attr('checked', true);
      myForm.find('input[name=q]').val('search term');
    },

    teardown : function() {
      $('form').remove();
      $.unsubscribe(this.pubsub);
    }
  });

  test("search input form is set up correctly", function() {
    expect(2);

    equals(myForm.find('input:checkbox').length, 2, 'Two service checkboxes created');
    equals(myForm.find('input:checkbox').eq(0).val(), 'a', 'Checkbox gets correct value');
  });

  test("view announces search when it should", function() {
    expect(3);

    myForm.trigger('submit');

    ok(done, 'Search is announced using /search topic');
    equals(term, 'search term', 'Search term is published');
    equals(data.length, 2, 'Two services are published when two services are selected');
  });

  test("view doesn't announce search when it shouldn't", function() {
    expect(2);
    done = false;

    myForm.find('input:checkbox').attr('checked', false);
    myForm.trigger('submit');

    ok(!done, 'Search is not broadcast if no services are selected');

    myForm.find('input:checkbox').attr('checked', true);
    myForm.find('input[name=q]').val('');
    myForm.trigger('submit');

    ok(!done, 'Search is not broadcast if no term is entered');
  });
});
