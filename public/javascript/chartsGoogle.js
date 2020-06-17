// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart', 'table'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawALL);
function drawALL() {
    // drawHistogram();
    // drawBoxAndWhiskers();
    drawPercentages();
    drawGradesTable();
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
    let max_number_of_evals = 0;
    box_data.forEach(course => {
        if (course != null) {
            let course_row = [];
            course_row.push(course.course);
            let number_of_evals = 0;
            course.evals.forEach(element => {
                if (element != null) {
                    number_of_evals++;
                    course_row.push(100, element.min, element.Q1, element.median, element.Q3, element.max, element.name + ":\n\tMax: " + element.max + "\n\tQ3: " + element.Q3 + "\n\tMedian: " + element.median + "\n\tQ1: " + element.Q1 + "\n\tMin: " + element.min);
                }
            });
            if (number_of_evals > max_number_of_evals) {
                max_number_of_evals = number_of_evals;
            }
            data_p.push(course_row);
        }
    });

    data_p.forEach(element => {
        while (element.length < 1 + max_number_of_evals * 7) {
            element.push(undefined);
        }
    });

    let data = new google.visualization.DataTable();

    // Declare columns
    data.addColumn('string', 'Course');
    for (let index = 0; index < max_number_of_evals; index++) {
        data.addColumn('number', 'Eval');
        data.addColumn({ id: 'min', type: 'number', role: 'interval' });
        data.addColumn({ id: 'firstQuartile', type: 'number', role: 'interval' });
        data.addColumn({ id: 'median', type: 'number', role: 'interval' });
        data.addColumn({ id: 'thirdQuartile', type: 'number', role: 'interval' });
        data.addColumn({ id: 'max', type: 'number', role: 'interval' });
        data.addColumn({ type: 'string', role: 'tooltip' })
    }
    // Add data.
    data.addRows(data_p);
    let options = {
        title: "Distribution of the students' grades in each evaluation activity",
        vAxis: {
            title: 'Grades'
        },
        // hAxis: {
        //     title: 'Courses',
        // },
        legend: { position: 'none' },
        dataOpacity: 0,
        tooltip: { isHtml: true },
        intervals: {
            barWidth: 1,
            boxWidth: 1,
            lineWidth: 1,
            style: 'boxes'
        },
        interval: {
            max: {
                style: 'bars',
                fillOpacity: 1,
            },
            min: {
                style: 'bars',
                fillOpacity: 1,
            }
        }
    };
    let chart = new google.visualization.ColumnChart(document.getElementById('box_plot'));
    chart.draw(data, options);
}

function drawPercentages() {
    // TODO: Change tooltip; value - percentile
    let data = new google.visualization.DataTable();

    // Declare columns
    data.addColumn('string', 'Percentage');
    data.addColumn('number', 'Value');
    data.addColumn({ id: 'min', type: 'number', role: 'interval' });
    data.addColumn({ id: 'firstQuartile', type: 'number', role: 'interval' });
    data.addColumn({ id: 'median', type: 'number', role: 'interval' });
    data.addColumn({ id: 'thirdQuartile', type: 'number', role: 'interval' });
    data.addColumn({ id: 'max', type: 'number', role: 'interval' });
    //data.addColumn({ type: 'string', role: 'tooltip' })
    // Add data.
    data.addRows(percentages_data);
    let options = {
        title: "Compare Adrienne Carney with the average student on the percentage of the indicators", //TODO: name change
        vAxis: {
            title: 'Percentage'
        },
        legend: { position: 'none' },
        lineWidth: 0,
        pointSize: 10,
        colors: ['#a52714'],
        pointShape: 'diamond',
        intervals: {
            color: 'grey',
            barWidth: 1,
            boxWidth: 1,
            lineWidth: 1,
            style: 'boxes'
        },
        interval: {
            max: {
                style: 'bars',
                fillOpacity: 1,
            },
            min: {
                style: 'bars',
                fillOpacity: 1,
            }
        }
    };
    let chart = new google.visualization.LineChart(document.getElementById('percentages_plot'));
    chart.draw(data, options);
}

function drawGradesTable() {
    let data_p = [];
    students_courses.forEach(element => {
        let course = grades_data[element.course];
        if (course != null) {
            if(course.evals.length == 0) {
                data_p.push([course.course, null, null, null]);
            }
            course.evals.forEach(element => {
                if (element != null) {
                    data_p.push([course.course, element.name, element.grade, element.percentile]);
                }
            });
        }
    });
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Course');
    data.addColumn('string', 'Evaluation');
    data.addColumn('number', 'Grade');
    data.addColumn('number', 'Percentile(of the evaluation)');
    data.addRows(data_p);
    let options = {
        title: "Grades",
    }

    let formatter = new google.visualization.ColorFormat();
    formatter.addGradientRange(0, .5, 'black','red', 'yellow');
    formatter.addGradientRange(0.5, 1.01, 'black','yellow', 'green');
    formatter.format(data, 3);

    let formatter1 = new google.visualization.ColorFormat();
    formatter1.addGradientRange(0, 75, 'black','red', 'yellow');
    formatter1.addGradientRange(75, 101, 'black','yellow', 'green');
    formatter1.format(data, 2);
    let table = new google.visualization.Table(document.getElementById('grades_plot'));
    

    
    table.draw(data, {allowHtml:true});
}