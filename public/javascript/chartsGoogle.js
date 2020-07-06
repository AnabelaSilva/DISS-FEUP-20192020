const height = 275;
const width = 550;

// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart', 'table', 'timeline'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawALL);

function draw_participation_on_course() {
    let data = new google.visualization.DataTable();

    data.addColumn({ id: 'Student', type: 'string' });
    data.addColumn('number', 'Percentage of participation');

    let aux = [];
    participation_info.forEach(element => {
        aux.push([element[1], element[2]]);
    });
    // Add data.
    data.addRows(aux);
    var options = {
        title: 'Distribution of the students by the percentage of participated activities on this course',
        legend: { position: 'none' },
        hAxis: {
            title: 'Percentage of participated activities',
            viewWindowMode: 'maximized',
            viewWindow: { max: 100 }
        },
        allowHtml: true,
        height: height,
        width: width,
        vAxis: {
            title: 'Number of students'
        }
    };

    let chart = new google.visualization.Histogram(document.getElementById('participation_on_course_plot'));

    // The select handler. Call the chart's getSelection() method
    function selectHandler() {
        var selectedItem = chart.getSelection()[0];
        if (selectedItem) {
            window.location.href = "/student?id=" + participation_info[selectedItem.row][0];
        }
    }
    google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(data, options);
}
function draw_timeline_on_course() {
    let data = new google.visualization.DataTable();

    data.addColumn('string', 'Row');
    data.addColumn('string', 'Bar');
    //data.addColumn('string', 'Tooltip');
    data.addColumn('datetime', 'Start');
    data.addColumn('datetime', 'End');

    let aux = [];
    timeline_info.forEach(element => {
        aux.push(['Assign', '' + element.id, new Date(element.start * 1000), new Date(element.end * 1000)]);
        element.students.forEach(ele => {
            aux.push(['Assign', '' + element.id, ele.start == null ? null : new Date(ele.start * 1000), ele.end == null ? null : new Date(ele.end * 1000)]);
        });
    });

    console.log(aux);
    // Add data.
    data.addRows(aux);
    var options = {
        title: 'TODO CAHNGE',

        allowHtml: true,
        height: height,
        width: width
    };

    let chart = new google.visualization.Timeline(document.getElementById('timeline_on_course_plot'));

    chart.draw(data, options);
}



function drawHistogram() {
    let data = new google.visualization.DataTable();

    // Declare columns


    data.addColumn({ id: 'Student', type: 'string' });
    data.addColumn('number', 'Percentage of participation');

    let aux = [];
    histogram_data.forEach(element => {
        aux.push([element[0], element[1]]);
    });
    // Add data.
    data.addRows(aux);
    var options = {
        title: 'Distribution of the students by the percentage of participated activities',
        legend: { position: 'none' },
        hAxis: {
            title: 'Percentage of participated activities',
            viewWindowMode: 'maximized',
            viewWindow: { max: 100 }
        },
        allowHtml: true,
        height: height,
        width: width,
        vAxis: {
            title: 'Number of students'
        }
    };

    let chart = new google.visualization.Histogram(document.getElementById('histogram'));

    // The select handler. Call the chart's getSelection() method
    function selectHandler() {
        var selectedItem = chart.getSelection()[0];
        if (selectedItem) {
            window.location.href = "/student?id=" + histogram_data[selectedItem.row][2];
        }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);

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
        height: height,
        width: width,
        legend: { position: 'none' },
        tooltip: { isHtml: true },
        intervals: {
            barWidth: 1,
            boxWidth: 1,
            lineWidth: 1,
            style: 'boxes'
        },
        interval: {
            max: {
                style: 'bars'
            },
            min: {
                style: 'bars'
            }
        },
        dataOpacity: 0

    };
    let chart = new google.visualization.ColumnChart(document.getElementById('box_plot'));

    chart.draw(data, options);
    d3.selectAll('#box_plot').selectAll('g[clip-path] > g:nth-child(2)').raise();

}
function drawCoursesDisplay() {
    let data = new google.visualization.DataTable();
    let res = [
        ['Participated Forums'],
        ['Attempted Quizzes'],
        ['Submitted Assignments'],
        ['OnTime Submissions']
    ];
    // Declare columns
    data.addColumn('string', 'Indicator');
    participation_by_course.forEach(element => {
        data.addColumn('number', element.name);
        data.addColumn({ id: 'min', type: 'number', role: 'interval' });
        data.addColumn({ id: 'firstQuartile', type: 'number', role: 'interval' });
        data.addColumn({ id: 'median', type: 'number', role: 'interval' });
        data.addColumn({ id: 'thirdQuartile', type: 'number', role: 'interval' });
        data.addColumn({ id: 'max', type: 'number', role: 'interval' });

        data.addColumn({ type: 'string', role: 'tooltip' })
    });
    participation_by_course.forEach(element => {
        if (element.forums.values[1] == null) {
            res[0].push(null, null, null, null, null, null, "No forums currently available!")

        } else {
            res[0].push(element.forums.values[0], element.forums.values[1], element.forums.values[2], element.forums.values[3], element.forums.values[4], element.forums.values[5], element.name + ":\n\tMax: " + element.forums.values[5].toFixed(1) + "\n\tQ3: " + element.forums.values[4].toFixed(1) + "\n\tMedian: " + element.forums.values[3].toFixed(1) + "\n\tQ1: " + element.forums.values[2].toFixed(1) + "\n\tMin: " + element.forums.values[1].toFixed(1));
        } if (element.quizzes.values[1] == null) {
            res[1].push(null, null, null, null, null, null, "No quizzes currently available!")

        } else {
            res[1].push(element.quizzes.values[0], element.quizzes.values[1], element.quizzes.values[2], element.quizzes.values[3], element.quizzes.values[4], element.quizzes.values[5], element.name + ":\n\tMax: " + element.quizzes.values[5].toFixed(1) + "\n\tQ3: " + element.quizzes.values[4].toFixed(1) + "\n\tMedian: " + element.quizzes.values[3].toFixed(1) + "\n\tQ1: " + element.quizzes.values[2].toFixed(1) + "\n\tMin: " + element.quizzes.values[1].toFixed(1));
        } if (element.assigns.values[1] == null) {
            res[2].push(null, null, null, null, null, null, "No assignments currently available!")

        } else {
            res[2].push(element.assigns.values[0], element.assigns.values[1], element.assigns.values[2], element.assigns.values[3], element.assigns.values[4], element.assigns.values[5], element.name + ":\n\tMax: " + element.assigns.values[5].toFixed(1) + "\n\tQ3: " + element.assigns.values[4].toFixed(1) + "\n\tMedian: " + element.assigns.values[3].toFixed(1) + "\n\tQ1: " + element.assigns.values[2].toFixed(1) + "\n\tMin: " + element.assigns.values[1].toFixed(1));
        } if (element.ontime.values[1] == null) {
            res[3].push(null, null, null, null, null, null, "No assignments currently available!")
        } else {
            res[3].push(element.ontime.values[0], element.ontime.values[1], element.ontime.values[2], element.ontime.values[3], element.ontime.values[4], element.ontime.values[5], element.name + ":\n\tMax: " + element.ontime.values[5].toFixed(1) + "\n\tQ3: " + element.ontime.values[4].toFixed(1) + "\n\tMedian: " + element.ontime.values[3].toFixed(1) + "\n\tQ1: " + element.ontime.values[2].toFixed(1) + "\n\tMin: " + element.ontime.values[1].toFixed(1));
        }   //res[0] = res[0].concat(element.forums.values);
        // res[1] = res[1].concat(element.quizzes.values);
        // res[2] = res[2].concat(element.assigns.values);
        // res[3] = res[3].concat(element.ontime.values);
    });
    // Add data.
    console.log(res);
    data.addRows(res);
    let options = {
        title: "Compare the courses by the percentages of participation",
        vAxis: {
            title: 'Percentages'
        },
        height: height,
        width: width,
        hAxis: {
            title: 'Indicators',
        },
        legend: { position: 'rigth' },
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
    let chart = new google.visualization.ColumnChart(document.getElementById('courses_plot'));
    chart.draw(data, options);
    d3.selectAll('#courses_plot').selectAll('g[clip-path] > g:nth-child(2)').raise();
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
function drawLastDays() {
    let data_p = last_access;
    let data = new google.visualization.DataTable();
    data.addColumn('number', 'ID');
    data.addColumn('string', 'Student');
    data.addColumn('number', 'Days since last access');
    data.addColumn('number', 'Mean number of activities per week per course enrolled');
    data.addRows(data_p);

    let options = {
        alternatingRowStyle: false,
        allowHtml: true,
        height: height,
        width: width,
        sortColumn: 0,
        cssClassNames: { headerCell: 'googleHeaderCell' },
        sort: 'event'
    }

    let formatter = new google.visualization.ColorFormat();
    formatter.addGradientRange(0, 7, 'black', 'green', 'yellow');
    formatter.addGradientRange(7, 15, 'black', 'yellow', 'red');
    formatter.addRange(null, null, 'black', 'red');
    formatter.format(data, 2);

    let table = new google.visualization.Table(document.getElementById('lastaccess_plot'));

    function selectHandler() {
        var selectedItem = table.getSelection()[0];
        if (selectedItem) {
            var value = data.getValue(selectedItem.row, 0);
            window.location.href = "/student?id=" + value;
        }
    }

    function sortHandler(e) {
        if (e.column == 0) {
            var sortValues = [];
            var sortRows = [];
            var sortDirection = (e.ascending) ? 1 : -1;
            for (var i = 0; i < data.getNumberOfRows(); i++) {
                sortValues.push(
                    data.getValue(i, e.column + 1)
                );
            }
            sortValues.sort(
                function (row1, row2) {
                    return row1.localeCompare(row2) * sortDirection;
                }
            );

            sortValues.forEach(function (sortValue) {
                sortRows.push(data.getFilteredRows([{ column: e.column + 1, value: sortValue }])[0]);
            });

            let rows = [];
            sortRows.forEach(element => {
                let row = [];
                for (let index = 0; index < data.getNumberOfColumns(); index++) {
                    row.push(data.getValue(element, index));
                }
                rows.push(row);
            });

            data.removeRows(0, data.getNumberOfRows());
            data.addRows(rows);
            formatter.format(data, 2);
            options.sortColumn = e.column;
            options.sortAscending = e.ascending;
            table.draw(view, options);

        } else {
            data.sort({ column: e.column + 1, desc: e.ascending });
            options.sortColumn = e.column;
            options.sortAscending = e.ascending;
            table.draw(view, options);
        }
    }

    google.visualization.events.addListener(table, 'select', selectHandler);
    google.visualization.events.addListener(table, 'sort', sortHandler);

    let view = new google.visualization.DataView(data);

    view.setColumns([1, 2, 3]);
    table.draw(view, options);
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
                    data_p.push([course.course, element.name, element.grade, Number(element.percentile.toFixed(2))]);
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
        if (course_name != data_p[index][0]) {
            color_id = (color_id + 1) % colors.length;
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
        allowHtml: true,
        sortColumn: 0,
        cssClassNames: { headerCell: 'googleHeaderCell' }
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
function drawTimelineDisplay() {
    // NOT GOOD
    let data_p = [];
    timeline_info.forEach(element => {
        data_p.push(
            [
                element.week,
                100 * element.student.done_activities_late / element.student.all_activities,

                100 * element.student.done_activities_on_time / element.student.all_activities,
                100 * element.average_late,
                100 * element.average_on_time

            ]
        );
    });
    console.log(data_p);
    let data = new google.visualization.DataTable();
    // Declare columns
    data.addColumn('number', 'Week');

    data.addColumn('number', 'LATES');
    data.addColumn('number', 'TIMES');
    data.addColumn('number', 'LATE');
    data.addColumn('number', 'TIME');

    // Add data.
    data.addRows(data_p);
    let options = {
        title: "Percentage of activities done(posts, quizzes attempst and submissions) each week",
        vAxis: {
            title: 'Number of activities'
        },
        series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 0 },
            2: { targetAxisIndex: 1 },
            3: { targetAxisIndex: 1 },
        }, vAxis: {
            viewWindow: {
                max: 100
            }
        },
        height: height,
        width: width,
        hAxis: {
            title: 'Week of the semester'
        },
        legend: {
            position: 'top'
        },
        focusTarget: 'category',
        isStacked: true
    };
    let chart = new google.visualization.AreaChart(document.getElementById('timeline_plot'));
    chart.draw(data, options);
}