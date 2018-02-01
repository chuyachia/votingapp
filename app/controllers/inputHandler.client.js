'use strict';
var $ = require('jquery');
window.jQuery = $;
require('bootstrap');

function inputHandler(){
  var i=2;
  var $form = $('form');  
  
  this.addEntry = function (e){
    e.preventDefault();
    var currentEntry = $(this).parents('.entry:first'),
    newEntry = $(currentEntry.clone()).insertAfter(currentEntry);
    newEntry.find('input').val('');
    newEntry.find('input').attr({name:'option'+i}); // use of naming option+i here?
    i++;
    $form.find('.entry:not(:last) .btn-add')
      .removeClass('btn-add').addClass('btn-remove')
      .removeClass('btn-success').addClass('btn-danger')
      .html('<span class="glyphicon glyphicon-minus"></span>')
  }
  
  this.removeEntry = function (e) {
    e.preventDefault();
    $(this).parents('.entry:first').remove();
    i--;
    return false;
  }
  
}

module.exports = inputHandler;