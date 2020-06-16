// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawHistogram);

function drawHistogram() {
    let data = new google.visualization.DataTable();

    // Declare columns
    data.addColumn('string', 'Student');
    data.addColumn('number', 'Percentage of participation');

    // Add data.
    data.addRows(histogram_data);
    var options = {
        title: 'Distribution of the students by the percentage of participated activities',
        legend: { position: 'none' },
        hAxis: {
            title: 'Percentage of participated activities',
            viewWindowMode: 'maximized',
            viewWindow: { max: 100 }
        },
        vAxis: {
            title: 'Number of students'
        }
    };

    let chart = new google.visualization.Histogram(document.getElementById('histogram'));
    chart.draw(data, options);
}

function drawVisualization() {
    // Create and populate the data table. Column 6: median, Column 7: mean. Values are invented!
    var data = google.visualization.arrayToDataTable([['Serie1', 20, 28, 38, 45, 20, 25], ['Serie2', 31, 38, 55, 66, 30, 35], ['Serie3', 50, 55, 77, 80, 10, 15], ['Serie4', 77, 77, 66, 50, 20, 25], ['Serie5', 68, 66, 22, 15, 30, 35]],
        true); // Treat first row as data as well.


    // Create and draw the visualization.
    var ac = new google.visualization.ComboChart(document.getElementById('visualization'));
    ac.draw(data, {
        title: 'Box Plot with Median and Average',
        width: 600,
        height: 400,
        vAxis: { title: "Value" },
        hAxis: { title: "Serie ID" },
        series: {
            0: { type: "candlesticks" },
            1: { type: "line", pointSize: 10, lineWidth: 0 },
            2: { type: "line", pointSize: 10, lineWidth: 0, color: 'black' }
        }
    });
}