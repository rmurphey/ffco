require.def(function() {
  var like = {
    register : function(url, cb) {
      $.post('/like', { url : url }, cb);
    }
  };

  $.subscribe('/like', like.register);
});
