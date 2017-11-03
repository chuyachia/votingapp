'use strict';

$(document).ready(function(){
    var allpolls = document.querySelector('#allpolls')||null;

  if (allpolls) {
     $.get('/allpolls',function(data,status){
       data.allpolls.forEach(function(poll){
           $('<div class="col-md-4 col-sm-4 col-xs-6"></div>')
             .html('<h2>'+poll.title+'</h2><p>'+ poll.description+'</p><a role="button" href="/poll/'+
                   poll._id+'">View</a><p class="note">'+poll.totalvote+' people voted on this</p>')
             .appendTo('div#allpolls')
       })
       if (data.user) {
         var username = data.user.displayName||data.user.username;
         $('#username').text(username);
         $('#message').text("Create your own poll by visiting your profile. You can also add options to others' polls.");
         $('#login').text('Logout');
         $('#login').attr({href:'/logout'});
         $('<a role="button" class="btn" href="/profile"></a>').text('Profile')
           .appendTo('header')
       }
     })
  }
})
