require.def(function() {
  return {
    handle : function(type, url) {
      console.log('Pretend we sent a POST about how we ' + type + ' ' + url);
    }
  }
});