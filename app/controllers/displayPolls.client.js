'use strict';
//// https://stackoverflow.com/questions/5329201/jquery-move-elements-into-a-random-order
//// https://stackoverflow.com/questions/21600802/jquery-sort-list-based-on-data-attribute-value

jQuery.fn.shuffle = function () {
    var j;
    for (var i = 0; i < this.length-1; i++) {
        j = Math.floor(Math.random() * this.length-1);
        $(this[i]).before($(this[j]));
    }
    return this;
};
function sort_div(a, b) {
    return ($(b).attr('id')) < ($(a).attr('id')) ? 1 : -1;
}

$(document).ready(function(){
   $('#unlogged').on('click',function(){
     alert('Please login first')
   })
   $("#sortselector").on('change',function(){
     if ($("#sortselector option:selected").val()=='random') {
        $('#allpolls div').shuffle();
     }
     else {
        $('#allpolls div').sort(sort_div).appendTo('#allpolls');
     }
   })
})
