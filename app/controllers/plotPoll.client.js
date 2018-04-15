'use strict';
var $ = require('jquery');
window.jQuery = $;
require('chart.js');

$(document).ready(function() {
  $('.ui.dropdown')
    .dropdown();
  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  });
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
              data: Object.keys(pug_data).map(function(key) {return pug_data[key];}),
          }]
      },
      options: {
        legend:{
         
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var allData = data.datasets[tooltipItem.datasetIndex].data;
              var tooltipLabel = data.labels[tooltipItem.index];
              var tooltipData = allData[tooltipItem.index];
              var total = 0;
              for (var i in allData) {
                total += allData[i];
              }
              var tooltipPercentage = Math.round((tooltipData / total) * 100);
              return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
            }
          }
        }
  	}
  });

})
