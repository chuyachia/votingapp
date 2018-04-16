'use strict'

var PollHandler = require(process.cwd()+ '/app/controllers/pollHandler.server.js');

module.exports = function(app,passport){
  var pollHandler = new PollHandler();
    
  function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	};
  
  
  app.route('/').get(pollHandler.getAllPolls)  

  app.route('/poll/:pollid')
      .get(pollHandler.getPollDetails)
      .post(pollHandler.checkIP,pollHandler.castVote);
  

  app.route('/auth/github')
  .get(passport.authenticate('github'));
  
  
  app.route('/auth/github/callback')
	.get(passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/' 
	}));
  
  app.route('/logout')
  .get(function (req, res) {
		req.logout();
		res.redirect('/');
	});
  
  app.route('/profile')
  .get(isLoggedIn,pollHandler.getOwnPolls);
  
  app.route('/newpoll')
    .post(isLoggedIn,pollHandler.createPoll);
  
  app.route('/delete')
    .post(isLoggedIn,pollHandler.deleteOwnPoll);
  
  app.use(function(req, res, next){
    res.status(404);
    res.render('notfound');
  });

};