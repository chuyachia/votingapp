'use strict'

var PollHandler = require(process.cwd()+ '/app/controllers/pollHandler.server.js'),
  configAuth = require(process.cwd()+'/app/config/auth.js');

module.exports = function(app,passport){
  var pollHandler = new PollHandler();
    
  function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	};
  
  app.use(function(req, res, next){
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
  });
  
  app.route('/').get(pollHandler.getAllPolls)  

  app.route('/poll/:pollid')
      .get(pollHandler.getPollDetails)
      .post(pollHandler.checkIP,pollHandler.castVote);
  

  app.route('/auth/github')
  .get(function(req,res,next){
    passport.authenticate('github',{
      callbackURL: configAuth.githubAuth.callbackURL+"?redirect=" +encodeURIComponent(req.query.curpath)
    })(req,res,next);
    
  });
  
  
  app.route('/auth/github/callback')
	.get(function(req,res,next){
	  passport.authenticate('github', {failureRedirect: '/',successRedirect:req.query.redirect})(req,res,next);
	});
  
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
    res.render('notfound',{authorized:req.isAuthenticated()});
  });

};