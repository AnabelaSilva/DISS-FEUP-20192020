const fetch = require('node-fetch');
const http = require("http");
const fs = require('fs');
//const url = require('url');
const Papa = require('papaparse');
const db = require("./database.js");

const url = new URL('http://localhost/webservice/rest/server.php');
const wstoken = 'a369f680e3cb5fab20997372ed53d1e1';//TODO: possibel to get ?
const moodlewsrestformat = 'json';
const SQLITE_LIMIT_VARIABLE_NUMBER = 999;
const coordinator_id_in_moodle = 103; //TODO: ID of the progam marter coordinator

exports.load_database = function () {
    delete_all_records_from_db();
    let params = new URLSearchParams([
        ['wstoken', wstoken],
        ['moodlewsrestformat', moodlewsrestformat],
        ['wsfunction', 'core_enrol_get_users_courses'],
        ['userid', coordinator_id_in_moodle]
    ]);
    url.search = params;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let courses = parse_list_of_courses(data);
            load_courses_to_db(courses);
            get_enrolled_students(courses);
            get_grades(courses);
            //get_logs(); //TODO: get from moodle?
            let activities = parse_logs(courses);
            load_activities_to_db(activities);
        });
}
function delete_all_records_from_db() {
    let tables = ['Activity','Grade', 'Evaluation', 'Student_in_Course', 'Student', 'Course'];
    let sql = 'DELETE FROM ';
    tables.forEach(element => {
        let sql_cmd = sql + element + ';';
        db.run(sql_cmd, [],
            function (err, result) {
                if (err) {
                    console.error(err);
                    console.trace();
                    return err;
                }
            }
        );
    });
}
function parse_list_of_courses(data) {
    let courses = [];
    data.forEach(element => {
        let course = { 'id': element.id, 'name': element.fullname };
        courses.push(course);
    });
    return courses;
}
function parse_list_of_students(data) {
    let students = [];
    data.forEach(element => {
        let student = { 'id': element.id, 'name': element.fullname };
        if (undefined != element['roles'].find(el => el['roleid'] == 5)) { //TODO: change 5 to roleid of students
            students.push(student);
        }
    });
    return students;
}
function parse_evaluation_and_grades(data) {
    let evaluation = [];
    let grades = [];
    data['usergrades'].forEach(element => {
        let student = element.userid;
        element['gradeitems'].forEach(item => {
            let assessment = { 'id': item.id, 'name': item.itemname, 'min': item.grademin, 'max': item.grademax, 'type_id': item.iteminstance, 'type': item.itemmodule };
            let grade = { 'student': student, 'value': item.graderaw, 'evaluation': item.id };
            evaluation.push(assessment);
            grades.push(grade);
        });
    });
    return { 'g': grades, 'e': evaluation };
}
function parse_logs(courses, students) {
    let activities = [];
    courses.forEach(element => {
        let file = fs.readFileSync('files/logs_' + element.id + '.csv', 'utf8');
        const results = Papa.parse(file, { header: true });
        results.data.forEach(elem => {
            let str = elem.Description;
            let activity = {};
            switch (true) {
                case /The user with id \'(\d)+\' has viewed the submission status page for the assignment with course module id \'(\d)+\'./.test(str):
                    activity.type = 1;
                    break;
                case /The user with id \'(\d)+\' has submitted the submission with id \'(\d)+\' for the assignment with course module id \'(\d)+\'./.test(str):
                    activity.type = 2;
                    break;
                case /The user with id \'(\d)+\' has submitted the attempt with id \'(\d)+\' for the quiz with course module id \'(\d)+\'./.test(str):
                    activity.type = 3;
                    break;
                case /The user with id \'(\d)+\' viewed the 'quiz' activity with course module id \'(\d)+\'/.test(str):
                    activity.type = 4;
                    break;
                case /The user with id \'(\d)+\' has viewed the discussion with id \'(\d)+\' in the forum with course module id \'(\d)+\'./.test(str):
                    activity.type = 5;
                    break;
                case /The user with id \'(\d)+\' has created the discussion with id \'(\d)+\' in the forum with course module id \'(\d)+\'/.test(str):
                    activity.type = 6;
                    break;
                case /The user with id \'(\d)+\' has created the post with id \'(\d)+\' in the discussion with id \'(\d)+\' in the forum with course module id \'(\d)+\'./.test(str):
                    activity.type = 7;
                    break;
                default:
                    break;
            }
            if (activity.type != null) {
                activity.student = str.match(/The user with id \'(\d+)\'/)[1];
                //TODO: take out teachers activity
                //if (students.find(el => el['id'] == activity.student)) {
                activity.date = elem['Time'];
                activity.course = element.id;
                activities.push(activity);
                //}
            }
        });
    });
    console.log(activities);
    return activities;
}
function get_enrolled_students(courses) {
    let params = new URLSearchParams([
        ['wstoken', wstoken],
        ['moodlewsrestformat', moodlewsrestformat],
        ['wsfunction', 'core_enrol_get_enrolled_users'],
    ]);
    courses.forEach(element => {
        params.set('courseid', element['id']);
        url.search = params;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let students = parse_list_of_students(data);
                load_students_to_db(students, element);
            });
    });
}
function get_grades(courses) {
    let params = new URLSearchParams([
        ['wstoken', wstoken],
        ['moodlewsrestformat', moodlewsrestformat],
        ['wsfunction', 'gradereport_user_get_grade_items'],
    ]);
    courses.forEach(element => {
        params.set('courseid', element['id']);
        url.search = params;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let grades = parse_evaluation_and_grades(data);
                load_grades_to_db(grades.g, grades.e, element);
            });
    });
}
function load_courses_to_db(courses) {
    let sql = 'INSERT INTO Course (id, name) VALUES ' + courses.map((x) => '(?,?)').join(',') + ';';
    let params = [].concat.apply([], courses.map((x) => [x['id'], x['name']]));
    db.run(sql, params,
        function (err, result) {
            if (err) {
                console.error(err);
                console.trace();
                return err;
            }
        }
    );
}
function load_grades_to_db(grades, evaluations, course) {
    if (evaluations.length > 0) {
        for (let index = 0; index < evaluations.length; index = index + Math.trunc(SQLITE_LIMIT_VARIABLE_NUMBER / 7)) {
            let eval_aux = evaluations.slice(index, index + Math.trunc(SQLITE_LIMIT_VARIABLE_NUMBER / 7));
            let sql = 'INSERT OR IGNORE INTO Evaluation (id, name, course, min, max, type_id, type) VALUES ' + eval_aux.map((x) => '(?,?,?,?,?,?,?)').join(',') + ';';
            let params = [].concat.apply([], eval_aux.map((x) => [x['id'], x['name'], course['id'], x['min'], x['max'], x['type_id'], x['type']]));
            db.run(sql, params,
                function (err, result) {
                    if (err) {
                        console.error(sql);
                        console.error(err);
                        console.trace();
                        return err;
                    }
                }
            );

        }
        for (let index = 0; index < grades.length; index = index + Math.trunc(SQLITE_LIMIT_VARIABLE_NUMBER / 3)) {
            let grades_aux = grades.slice(index, index + Math.trunc(SQLITE_LIMIT_VARIABLE_NUMBER / 3));
            sql = 'INSERT INTO Grade (value, student, evaluation) VALUES ' + grades_aux.map((x) => '(?,?,?)').join(',') + ';';
            params = [].concat.apply([], grades_aux.map((x) => [x['value'], x['student'], x['evaluation']]));
            db.run(sql, params,
                function (err, result) {
                    if (err) {
                        console.error(sql);
                        console.error(err);
                        console.trace();
                        return err;
                    }
                }
            );
        }
    }
}
function load_students_to_db(students, course) {
    if (students.length > 0) {
        let sql = 'INSERT OR IGNORE INTO Student (id, name) VALUES ' + students.map((x) => '(?,?)').join(',') + ';';
        let params = [].concat.apply([], students.map((x) => [x['id'], x['name']]));
        db.run(sql, params,
            function (err, result) {
                if (err) {
                    console.error(sql);
                    console.error(err);
                    console.trace();
                    return err;
                }
            }
        );

        sql = 'INSERT INTO Student_in_Course (student, course) VALUES ' + students.map((x) => '(?,?)').join(',') + ';';
        params = [].concat.apply([], students.map((x) => [x['id'], course['id']]));
        db.run(sql, params,
            function (err, result) {
                if (err) {
                    console.error(sql);
                    console.error(err);
                    console.trace();
                    return err;
                }
            }
        );
    }
}
function load_activities_to_db(activities) {
    if (activities.length > 0) {
        let sql = 'INSERT INTO Activity (date, student, course, type) VALUES ' + activities.map((x) => '(?,?,?,?)').join(',') + ';';
        let params = [].concat.apply([], activities.map((x) => [x['date'], x['student'], x['course'],x['type']]));
        db.run(sql, params,
            function (err, result) {
                if (err) {
                    console.error(sql);
                    console.error(err);
                    console.trace();
                    return err;
                }
            }
        );
    }
}