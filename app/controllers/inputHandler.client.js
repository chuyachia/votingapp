'use strict';
var $ = require('jquery');
window.jQuery = $;

function inputHandler(){
  var i=2;
  var $form = $('form');  
  
  this.addEntry = function (e){
    e.preventDefault();
    var currentEntry = $(this).parents('.input:first'),
    newEntry = $(currentEntry.clone()).insertAfter(currentEntry);
    newEntry.find('input').val('');
    newEntry.find('input').attr({name:'option'+i});
    i++;
    $form.find('.input:not(:last) .positive')
      .removeClass('positive').addClass('negative')
      .html('<i class="icon minus"></span>')
  }
  
  this.removeEntry = function (e) {
    e.preventDefault();
    $(this).parents('.input:first').remove();
    return false;
  }
  
}

module.exports = inputHandler;