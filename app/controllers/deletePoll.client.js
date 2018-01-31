'use strict';
var $ = require('jquery');
window.jQuery = $;

module.exports = function (e){
  e.preventDefault();
  var result = confirm("Are you sure you want to delete this poll?");
  if (result) {
    var id = $(this).attr('id')
    var data = { "pollid" : id };
    $.ajax({
      url: '/delete', 
      type: 'POST', 
      contentType: 'application/json', 
      data: JSON.stringify(data)}
    ).done(function(data){
       location.reload()
     })
  } 
}
