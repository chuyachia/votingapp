
'use strict';
$(document).ready(function(){
    var allpolls = document.querySelector('#allpolls')||null;

  if (allpolls) {
     $.get('/allpolls',function(data,status){
       console.log(data)
       data.allpolls.forEach(function(user){
         user.polls.forEach(function(poll){
           $('<div class="col-md-4"></div>')
             .html('<h2>'+poll.title+'</h2><p>'+ poll.description+'</p><a role="button" class="btn" href="/poll/'+poll._id+'">View</a>')
             .appendTo('div#allpolls')
         })
       })
       if (data.user) {
         var username = data.user.displayName||data.user.username;
         $('#username').text(username);
         $('#message').text("You can now create your own poll by visiting your profile");
         $('#login').text('Logout');
         $('#login').attr({href:'/logout'});
         $('<a role="button" class="btn" href="/profile"></a>').text('Profile')
           .appendTo('header')
       }
     })
  }
})
