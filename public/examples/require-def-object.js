require.def(function() {
  var privateThing = 'myPrivateThing',

      privateObj = {
        maxLength : 5,

        setPrivateThing : function(val) {
          // creating a setter lets us enforce some rules if we want
          if (val.length > this.maxLength) {
            console.log('TOO MUCH');
            return;
          }

          privateThing = val;
        },

        otherMethod : function() {
          console.log(privateThing);
        }
      };

  // return just the parts of our object we want to expose;
  // note that privateObj and privateThing aren't exposed
  // outside of the enclosing function.
  return {
    setPrivateThing : $.proxy(privateObj, 'setPrivateThing'),
    publicMethod : $.proxy(privateObj, 'otherMethod')
  };
});
