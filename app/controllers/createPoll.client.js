'use strict';
var $ = require('jquery');
window.jQuery = $;
require('bootstrap');

var i=2;
$(document).on('click', '.btn-add', function(e)
{
  e.preventDefault();
  var currentEntry = $(this).parents('.entry:first'),
      newEntry = $(currentEntry.clone()).insertAfter(currentEntry);
  newEntry.find('input').val('');
  newEntry.find('input').attr({name:'option'+i});
  i++
  $('form').find('.entry:not(:last) .btn-add')
    .removeClass('btn-add').addClass('btn-remove')
    .removeClass('btn-success').addClass('btn-danger')
    .html('<span class="glyphicon glyphicon-minus"></span>');

}).on('click', '.btn-remove', function(e)
{
  $(this).parents('.entry:first').remove();
  e.preventDefault();
  return false;
});

 $(".delete").on('click',function(e){
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
 })
  
