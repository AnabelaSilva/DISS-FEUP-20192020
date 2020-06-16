// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawALL);
function drawALL() {
    drawHistogram();
    drawBoxAndWhiskers();
}

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

function drawBoxAndWhiskers() {
    let data_p = [];
    box_data.forEach(course => {
        if (course != null)
            course.evals.forEach(element => {
                if (element != null) {
                    data_p.push([element.name, element.min,element.min, element.Q1, element.median, element.Q3, element.max]);
                }
            });
    });

    let data = new google.visualization.DataTable();

    // Declare columns
    data.addColumn('string', 'Evaluation');
    data.addColumn('number', 'TTTTTTT')
    data.addColumn({ id: 'min', type: 'number', role: 'interval' });
    data.addColumn({ id: 'firstQuartile', type: 'number', role: 'interval' });
    data.addColumn({ id: 'median', type: 'number', role: 'interval' });
    data.addColumn({ id: 'thirdQuartile', type: 'number', role: 'interval' });
    data.addColumn({ id: 'max', type: 'number', role: 'interval' });
    // Add data.
    data.addRows(data_p);
    let options = {
        title: 'Box Plot',
        legend: { position: 'none' },
        lineWidth: 0,
        intervals: {
            barWidth: 1,
            boxWidth: 1,
            lineWidth: 2,
            style: 'boxes'
        },
        interval: {
            max: {
                style: 'bars',
                fillOpacity: 1,
                color: '#777'
            },
            min: {
                style: 'bars',
                fillOpacity: 1,
                color: '#777'
            }
        }
    };
    let chart = new google.visualization.LineChart(document.getElementById('box_plot'));
    chart.draw(data, options);
}