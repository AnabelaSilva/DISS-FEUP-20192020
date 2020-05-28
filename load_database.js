const fetch = require('node-fetch');
const http = require("http");
const fs = require('fs');
//const url = require('url');
const db = require("./database.js");

const url = new URL('http://localhost/webservice/rest/server.php');
const wstoken = 'a369f680e3cb5fab20997372ed53d1e1';//TODO: possibel to get ?
const moodlewsrestformat = 'json';
const SQLITE_LIMIT_VARIABLE_NUMBER = 999;
const coordinator_id_in_moodle = 103; //TODO: ID of the progam marter coordinator
    
exports.load_database = function (req, res) {
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
            //get_assign(); mod_assign_get_submissions
            //get_quiz(); mod_quiz_get_user_attempts
            //get_forum();
        });
    res.redirect('/');
}
function delete_all_records_from_db() {
    let tables = ['Grade', 'Evaluation','Student_in_Course', 'Student', 'Course'];
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
            let assessment = { 'id': item.id, 'name': item.itemname, 'min': item.grademin, 'max': item.grademax, 'type_id': item.iteminstance, 'type': item.itemmodule};
            let grade = { 'student': student, 'value': item.graderaw, 'evaluation': item.id };
            evaluation.push(assessment);
            grades.push(grade);
        });
    });
    return { 'g': grades, 'e': evaluation };
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
            console.log(index);
            let sql = 'INSERT OR IGNORE INTO Evaluation (id, name, course, min, max, type_id, type) VALUES ' + eval_aux.map((x) => '(?,?,?,?,?,?,?)').join(',') + ';';
            let params = [].concat.apply([], eval_aux.map((x) => [x['id'], x['name'], course['id'], x['min'], x['max'], x['type_id'],x['type']]));
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