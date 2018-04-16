'use strict'

var Users = require(process.cwd()+'/app/models/users.js');

function pollHandler(){
  
  var populatePoll = function(req,res,result){
      var results_dict = {}
      var state = req.query.state||null;

      result.polls[0].options.forEach(function(option){results_dict[option.optionname] = option.vote.length});
      res.render('poll',{ title: result.polls[0].title, message: result.polls[0].description, state:state,
                         action:'/poll/'+req.params.pollid,authorized:req.isAuthenticated(),
                         options:result.polls[0].options.map(function(x){return x.optionname;}),
                        results:results_dict})
  }
  
  var shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }
  
  this.getAllPolls = function(req,res) {
    var data={}
    if (req.isAuthenticated()) {
      data['authorized'] =true
      data['user'] =req.user.github.displayName||req.user.user.username;
      data['message'] ="You can create your own poll now. By the way, you can also add options to others' polls."
    } else {
      data['authorized'] =false
      data['user'] = "visitor"
      data['message'] ="Login and create your own poll"
    }
    data['polls_arr'] = []
    Users.aggregate([{$unwind:'$polls'},{$unwind:'$polls.options'},
                {$project:{"polls._id":1,'polls.title':1,'polls.description':1,'polls._id':1,
                           votecount:{$size:"$polls.options.vote"}}},
                {$group:{_id:"$polls._id",title:{$first: '$polls.title'},
                         description:{$first: '$polls.description'},
                         totalvote:{$sum:"$votecount"}}},
                {$sort:{"totalvote":-1}}])
    .exec(function(err,result){
      if (err) throw err;
      data['polls_arr'] = result
      res.render('index',data)   
    })
  }
  
  
  this.getPollDetails = function(req,res){
    if (req.params.pollid.match(/^[0-9a-fA-F]{24}$/)){
     Users.findOne({'polls._id':req.params.pollid},{'polls.$':1})
            .exec(function(err,result){
            if (err) throw err;
            if(!result){
              res.status(404);
              res.render('notfound',{authorized:req.isAuthenticated()});
            } else{
              populatePoll(req,res,result)
            }
      })
    } else {
      res.status(404);
      res.render('notfound',{authorized:req.isAuthenticated()});
    }
  }
  
  this.checkIP = function(req,res,next){
    var ip = req.headers['x-forwarded-for'];
    ip = ip.split(',')[0];
    Users.findOne({polls:{$elemMatch:{_id:req.params.pollid,'options.vote':ip}}}) //
          .exec(function(err,result){
         if (err) throw err;
         if (result) {res.redirect('/poll/'+req.params.pollid+'?state=failed')}  else {
           return next();
         }
    })
  }
  
  this.castVote = function(req,res){
        var update = {}
        var ip = req.headers['x-forwarded-for'];
        ip = ip.split(',')[0];
        if (req.body.choice=="-1" && req.body.addoption && req.isAuthenticated()) {
          update['optionname'] = req.body.addoption;
          update['vote'] = [ip]   
          Users.findOne({'polls._id':req.params.pollid},{'polls.$.options':1})
                .exec(function(err,result){
                var existopts  = result.polls[0].options.map(function(option){return option.optionname});
                if (existopts.indexOf(req.body.addoption)==-1) {
                    Users.findOneAndUpdate({'polls._id':req.params.pollid},{$push:{'polls.$.options':update}},{new:true})
                      .exec(function(err,result){
                          if (err) throw err;
                          res.redirect('/poll/'+req.params.pollid+'?state=success')
                        }) 
                  } 
                else {
                  res.redirect('/poll/'+req.params.pollid+'?state=success')
                }
              })
        } else {
          update['polls.$.options.'+req.body.choice+'.vote'] = ip
          Users.findOneAndUpdate({'polls._id':req.params.pollid},{$push:update},{ new: true })
              .exec(function(err,result){
              if (err) throw err;
              res.redirect('/poll/'+req.params.pollid+'?state=success')
        })
        }
  }
  
  this.createPoll= function(req,res){
    console.log(req.body)
    var newpoll = {}
    var options = []
    Object.keys(req.body).forEach(function(key) {
      if (key=='pollTitle') {
        newpoll['title'] = req.body[key];
      } else if (key=='pollDescription') {
        newpoll['description']=  req.body[key]
      } else {
        var existopts = options.map(function(x){return x.optionname});
        if (existopts.indexOf(req.body[key])==-1) {
        options.push({'optionname':req.body[key],'vote':[]})
          }
      }
    });
    newpoll['options'] = options
    Users.findOneAndUpdate({'github.id':req.user.github.id},{$push:{polls:newpoll}},{new:true})
          .exec(function(err,result){
          if (err) throw err;
          res.redirect('/profile');
    })

  }
  
  this.getOwnPolls = function(req,res) {
    Users.findOne({'github.id':req.user.github.id},{'polls.title':1,'polls._id':1})
          .exec(function(err,result){
        if (err) throw err;
        var user = req.user.github.displayName||req.user.github.username
        var polls_dict = {}
        result.polls.forEach(function(poll){polls_dict[poll.title]=poll._id})
        res.render('profile',{user:user,
                             polls_dict:polls_dict,
                             authorized:req.isAuthenticated()})
    })
  }
  
  this.deleteOwnPoll = function(req,res,next){
   Users.findOneAndUpdate({'github.id':req.user.github.id}, { $pull: { polls: { _id: req.body.pollid} }},{new:true})
        .exec(function(err,result){
         if (err) throw err;
           res.json('Deleted')
      })
  }

}

module.exports = pollHandler;