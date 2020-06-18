const height = 250;
const width = 500;
// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart', 'table'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawALL);

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
    percentages_data.forEach(element => {
        element[7] = student.name + " -> " + element[1].toFixed(2) + "%\n They are on the " + element[7].toFixed(2) + " percentile";
    });
    let data = new google.visualization.DataTable();

    // Declare columns
    data.addColumn('string', 'Percentage');
    data.addColumn('number', 'Value');
    data.addColumn({ id: 'min', type: 'number', role: 'interval' });
    data.addColumn({ id: 'firstQuartile', type: 'number', role: 'interval' });
    data.addColumn({ id: 'median', type: 'number', role: 'interval' });
    data.addColumn({ id: 'thirdQuartile', type: 'number', role: 'interval' });
    data.addColumn({ id: 'max', type: 'number', role: 'interval' });
    data.addColumn({ type: 'string', role: 'tooltip' })
    // Add data.
    data.addRows(percentages_data);
    let options = {
        title: "Compare " + student.name + " with the average student on the percentage of the indicators",
        vAxis: {
            title: 'Percentage'
        },
        height: height,
        width: width,
        tooltip: { isHtml: true },
        legend: { position: 'none' },
        lineWidth: 0,
        pointSize: 10,
        colors: ['blue'],
        pointShape: 'diamond',
        intervals: {
            color: 'red',
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
            if (course.evals.length == 0) {
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
    data.addColumn('number', 'Percentile');
    data.addRows(data_p);

    let colors = ['#3366cc ', '#dc3912 ', '#ff9900 ', '#109618 ', '#990099 ', '#0099c6 ', '#dd4477 ', '#66aa00 ', '#b82e2e ', '#316395 ', '#994499 ', '#22aa99 ', '#aaaa11 ', '#6633cc ', '#e67300 ', '#8b0707 ', '#651067 ', '#329262 ', '#5574a6 ', '#3b3eac ', '#b77322 ', '#16d620 ', '#b91383 ', '#f4359e ', '#9c5935 ', '#a9c413 ', '#2a778d ', '#668d1c ', '#bea413 ', '#0c5922 ', '#743411'];
    let color_id = -1;
    let course_name = "";
    for (let index = 0; index < data_p.length; index++) {
        if(course_name != data_p[index][0]){
            color_id = (color_id+1)% colors.length;
            course_name = data_p[index][0];
        }
        data.setProperty(index, 0, 'style', 'background-color: ' + colors[color_id] + ';');
        data.setProperty(index, 1, 'style', 'background-color: ' + colors[color_id] + ';');
        data.setProperty(index, 2, 'style', 'background-color: ' + colors[color_id] + ';');
        data.setProperty(index, 3, 'style', 'background-color: ' + colors[color_id] + ';');
    }

    let options = {
        title: "Grades",
        height: height,
        width: width,
        alternatingRowStyle: false,
        allowHtml: true
    }

    let formatter = new google.visualization.ColorFormat();
    formatter.addGradientRange(0, .5, 'black', 'red', 'yellow');
    formatter.addGradientRange(0.5, 1.01, 'black', 'yellow', 'green');
    formatter.format(data, 3);

    let formatter1 = new google.visualization.ColorFormat();
    formatter1.addGradientRange(0, 75, 'black', 'red', 'yellow');
    formatter1.addGradientRange(75, 101, 'black', 'yellow', 'green');
    formatter1.format(data, 2);
    let table = new google.visualization.Table(document.getElementById('grades_plot'));
    table.draw(data, options);
}

function drawWeekly() {
    let data_p = [];
    weekly_activities.forEach(element => {
        data_p.push([element.week, element.student, element.average]);
    });

    let data = new google.visualization.DataTable();
    // Declare columns
    data.addColumn('number', 'Week');
    data.addColumn('number', student.name);
    data.addColumn('number', 'Average Student');
    // Add data.
    data.addRows(data_p);
    let options = {
        title: "Number of activities(posts, quizzes attempst and submissions) per week per course",
        vAxis: {
            title: 'Number of activities'
        },
        height: height,
        width: width,
        hAxis: {
            title: 'Week of the semester'
        },
        legend: {
            position: 'top'
        }
    };
    let chart = new google.visualization.LineChart(document.getElementById('week_plot'));
    chart.draw(data, options);
}

function drawIndicators() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Indicator');
    data.addColumn('number', student.name);
    data.addColumn('number', 'Average Student');

    data.addRows(indicators);

    var options = {
        title: 'Compare ' + student.name + ' with the average of students on the indicators',
        legend: {
            position: 'top'
        },
        height: height,
        width: width,
        focusTarget: 'category'
    };

    var chart = new google.visualization.ColumnChart(
        document.getElementById('indicators_plot'));

    chart.draw(data, options);
}