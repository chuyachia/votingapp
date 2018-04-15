'use strict';
var modalHandler = require('./modalHandler.client.js');
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
    modalHandler();
    
    $('.ui.dropdown')
        .dropdown();
    
    $('.ui.checkbox').checkbox({ 
        onChecked: function() {
            if($('.ui.checkbox input:checked').val()=="random"){
                $('#allpolls .card').shuffle();
            } else {
                $('#allpolls .card').sort(sort_div).appendTo('#allpolls');
            }
        }
    });
  
   $('#unlogged').on('click',function(){
     alert('Please login first')
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


