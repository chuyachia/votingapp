'use strict';
var InputHandler = require('./inputHandler.client.js');
var $ = require('jquery');
window.jQuery = $;

module.exports = function(){
    var inputHandler = new InputHandler();

    $('#showmodal').on('click',function(){
        $('.ui.modal')
        .modal('show');
    })


    $(document).on('click','.positive', inputHandler.addEntry)
    .on('click', '.negative', inputHandler.removeEntry);
    
}