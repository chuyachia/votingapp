'use strict'
//TODO: sort votes on index.html by trending (most voted) and latest
var Users = require(process.cwd()+'/app/models/users.js');

function pollHandler(){
  
  var populatePoll = function(req,res,result,state){
      var results_dict = {}
      var state = state||null;
      if (req.query.state == 'voted'&!state) {
        state = 'You already voted on this one'
      }
      result.polls[0].options.forEach(function(option){results_dict[option.optionname] = option.vote.length});
      res.render('poll',{ title: result.polls[0].title, message: result.polls[0].description, state:state,
                         action:'/poll/'+req.params.pollid,authorized:req.isAuthenticated(),
                         options:result.polls[0].options.map(function(x){return x.optionname;}),
                        results:results_dict})
  }
  
  this.getAllPolls= function(req,res){
    
    Users.aggregate([{$unwind:'$polls'},{$unwind:'$polls.options'},
                    {$project:{"polls._id":1,'polls.title':1,'polls.description':1,'polls._id':1,
                               votecount:{$size:"$polls.options.vote"}}},
                    {$group:{_id:"$polls._id",title:{$first: '$polls.title'},
                             description:{$first: '$polls.description'},
                             totalvote:{$sum:"$votecount"}}},
                    {$sort:{"totalvote":-1}}])
          .exec(function(err,result){
          if (err) throw err;
          var returnObj = {};
          returnObj['allpolls'] = result;
          if (req.isAuthenticated()){
            returnObj['user'] = req.user.github
            res.json(returnObj)
          } else {
            returnObj['user'] = null
            res.json(returnObj)
          }
          })
    
  /*  Users.find({},{'polls.title':1,'polls.description':1,'polls._id':1})
          .exec(function(err,result){
          if (err) throw err;
          var returnObj = {};
          returnObj['allpolls'] = result
          if (req.isAuthenticated()){
            returnObj['user'] = req.user.github
            res.json(returnObj)
          } else {
            returnObj['user'] = null
            res.json(returnObj)
          }
    })*/
  }
  
  this.getPollDetails = function(req,res){  
   Users.findOne({'polls._id':req.params.pollid},{'polls.$':1})
          .exec(function(err,result){
          if (err) throw err;
          populatePoll(req,res,result)
    })
  }
  
  this.checkIP = function(req,res,next){
    var ip = req.headers['x-forwarded-for'];
    ip = ip.split(',')[0];
    Users.findOne({polls:{$elemMatch:{_id:req.params.pollid,'options.vote':'ip'}}}) //
          .exec(function(err,result){
         if (err) throw err;
         if (result) {res.redirect('/poll/'+req.params.pollid+'?state=voted')}  else {
           return next();
         }
    })
  }
  
  this.castVote = function(req,res,next){
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
                          return next();
                        }) 
                  } 
                else {
                  return next();
                }
              })
        } else {
          update['polls.$.options.'+req.body.choice+'.vote'] = ip
          Users.findOneAndUpdate({'polls._id':req.params.pollid},{$push:update},{ new: true })
              .exec(function(err,result){
              if (err) throw err;
              return next();
        })
        }
  }
  
  this.createPoll= function(req,res){
    var newpoll = {}
    var options = []
    Object.values(req.body).forEach(function(val,index) {
      if (index==0) {
        newpoll['title'] = val;
      } else if (index==1) {
        newpoll['description']= val
      } else {
        var existopts = options.map(function(x){return x.optionname});
        if (existopts.indexOf(val)==-1) {
        options.push({'optionname':val,'vote':[]})
          }
      }
    });
    newpoll['options'] = options
    Users.findOneAndUpdate({'github.id':req.user.github.id},{$push:{polls:newpoll}},{new:true})
          .exec(function(err,result){
          if (err) throw err;
          res.redirect('/profile')
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
                             action:'/newpoll'})
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