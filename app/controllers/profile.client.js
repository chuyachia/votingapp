'use strict';
var InputHandler = require('./inputHandler.client.js');
var deletePoll = require('./deletePoll.client.js');
var modalHandler = require('./modalHandler.client.js');


var $ = require('jquery');
window.jQuery = $;

$(document).ready(function(){
  modalHandler();
  
  $('.ui.dropdown')
  .dropdown();
  
  $(".delete").on('click',deletePoll)
  
})