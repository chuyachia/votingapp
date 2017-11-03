'use strict';

$(function()
{
console.log(pug_data);
var ctx= $("#myChart")[0].getContext('2d');

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
var colors = []
for (var i = 0; i < Object.keys(pug_data).length; i++) {
  colors.unshift(getRandomColor())
}
  
var chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: Object.keys(pug_data),
        datasets: [{
            backgroundColor: colors,
            borderColor: '#ffffff',
            data: Object.values(pug_data),
        }]
    },
    options: {}
});
  
})
