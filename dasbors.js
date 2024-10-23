$(function () {
    $('#sidebar').load('sidebar.html');
    $('#card').load('card.html');
})
// Initialize the line chart
var options = {
    chart: {
        type: 'line',
        height: 250
    },
    series: [{
        name: 'Sales',
        data: [200, 400, 600, 800, 1000, 1200]
    }],
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    colors: ['#007bff']
};
var chart = new ApexCharts(document.querySelector("#line-chart"), options);
chart.render();

// Initialize the pie chart
var pieOptions = {
    chart: {
        type: 'pie',
        height: 200
    },
    series: [62, 33, 10],
    labels: ['17 - 30 Years old', '31 - 50 Years old', '>= 50 Years old'],
    colors: ['#007bff', '#ff9500', '#ffcc00']
};
var pieChart = new ApexCharts(document.querySelector("#pie-chart"), pieOptions);
pieChart.render();

