var InputHandler = require('./inputHandler.client.js');
var deletePoll = require('./deletePoll.client.js');

var $ = require('jquery');
window.jQuery = $;

$(document).ready(function(){
  var inputHandler = new InputHandler();
  $(document).on('click','.btn-add', inputHandler.addEntry)
  .on('click', '.btn-remove', inputHandler.removeEntry);
  
  $(".delete").on('click',deletePoll)
  
})