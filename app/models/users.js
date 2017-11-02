'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({github:
                       {
                         id:String,
                         displayName:String,
                         username:String
                       },
                      polls:
                      [
                        {
                          title:String,
                          description:String,
                          options:
                        [
                          {
                            optionname:String,
                            vote:[String]
                          }
                        ]
                        }
                      ]
                      })

module.exports = mongoose.model('User',User);