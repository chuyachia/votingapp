'use strict';
var InputHandler = require('./inputHandler.client.js');
var $ = require('jquery');
window.jQuery = $;

$.fn.shuffle = function () {
    var j;
    for (var i = 0; i < this.length-1; i++) {
        j = Math.floor(Math.random() * this.length-1);
        $(this[i]).before($(this[j]));
    }
    return this;
};

function sort_div(a, b) {
    return ($(b).attr('id')) < ($(a).attr('id')) ? 1 : -1;
}


$(document).ready(function(){
  var inputHandler = new InputHandler();
  
  $(document).on('click','.btn-add', inputHandler.addEntry)
  .on('click', '.btn-remove', inputHandler.removeEntry);
  
   $('#unlogged').on('click',function(){
     alert('Please login first')
   })
   $("#sortselector").on('change',function(){
     if ($("#sortselector option:selected").val()=='random') {
        $('#allpolls div').shuffle();
     }
     else {
        $('#allpolls div').sort(sort_div).appendTo('#allpolls');
     }
   })
  $(".showmore").on('click',function(){
    $("#allpolls").children().removeClass("hidden");
    $(this).addClass('hidden');
    $(".showless").removeClass('hidden'); 
  })
  
  $(".showless").on('click',function(){
    $('#allpolls').children().not("#addpoll").slice(5).addClass("hidden");
    $(this).addClass('hidden');
    $(".showmore").removeClass('hidden'); 
  }) 
})


