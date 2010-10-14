require.def(function(){
  var Person = {
    intro : 'My name is ',
    outro : '. You killed my father. Prepare to die.',
    
    speak : function() {
      console.log(
        this.intro, 
        this.firstName, 
        this.lastName,
        this.outro
      );
    }
  };
  
  return function(config) {
    return $.extend(Object.create(Person), {
      firstName : config.firstName,
      lastName : config.lastName
    });
  };
});
