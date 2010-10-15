require.def(['./require-def-factory'], function(speakerFactory) {
  var mySpeaker = speakerFactory({
    firstName : 'Rebecca',
    lastName : 'Murphey'
  });
  
  console.log('I just do this and don\'t return anything');
});