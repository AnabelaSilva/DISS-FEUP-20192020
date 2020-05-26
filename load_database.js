const fetch = require('node-fetch');
const http = require("http");
const fs = require('fs');
const url = require('url');
const db = require("./database.js");

exports.load_database = function (req, res) {
    delete_all_records_from_db();
    let url = new URL('http://localhost/webservice/rest/server.php');
    let params = new URLSearchParams([
        ['wstoken', '2a31fe7fde8a21ce21761b57c4716df0'], //TODO: possibel to get ?
        ['moodlewsrestformat', 'json'],
        ['wsfunction', 'core_enrol_get_users_courses'],
        ['userid', 6] //TODO: ID of the progam marter coordinator
    ]);
    url.search = params;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let courses = parse_list_of_courses(data);
            load_courses_to_db(courses);
            get_enrolled_students(courses);
            get_grades(courses);
        });
    res.redirect('/');
}

function delete_all_records_from_db() {
    let tables = ['Student_in_Course', 'Student', 'Course'];
    let sql = 'DELETE FROM ';
    tables.forEach(element => {
        let sql_cmd = sql + element + ';';
        db.run(sql_cmd, [],
            function (err, result) {
                if (err) {
                    console.log(err);
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
    console.log(data['usergrades']);
    data['usergrades'].forEach(element => {
        let student = element.userid;
        element['gradeitems'].forEach(item => {
            let assessment = { 'id':item.id,'name':item.itemname,'min':item.grademin,'max':item.grademax};
            let grade = {'student': student, 'value':item.graderaw, 'evaluation':item.id};
            evaluation.push(assessment);
            grades.push(grade);
        });
    });
    return { 'g':grades, 'e':evaluation};
}
function get_enrolled_students(courses) {
    let url = new URL('http://localhost/webservice/rest/server.php');
    let params = new URLSearchParams([
        ['wstoken', '2a31fe7fde8a21ce21761b57c4716df0'], //TODO: possibel to get ?
        ['moodlewsrestformat', 'json'],
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
    let url = new URL('http://localhost/webservice/rest/server.php');
    let params = new URLSearchParams([
        ['wstoken', '2a31fe7fde8a21ce21761b57c4716df0'], //TODO: possibel to get ?
        ['moodlewsrestformat', 'json'],
        ['wsfunction', 'gradereport_user_get_grade_items'],
    ]);
    courses.forEach(element => {
        params.set('courseid', element['id']);
        url.search = params;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let grades = parse_evaluation_and_grades(data);
                load_grades_to_db(grades.g,grades.e, element);
            });
    });
}
function load_courses_to_db(courses) {
    let sql = 'INSERT INTO Course (id, name) VALUES ' + courses.map((x) => '(?,?)').join(',') + ';';
    let params = [].concat.apply([], courses.map((x) => [x['id'], x['name']]));
    db.run(sql, params,
        function (err, result) {
            if (err) {
                console.log(err);
                console.trace();
                return err;
            }
        }
    );
}
function load_grades_to_db(grades, evaluations, course) {
    if (evaluations.length > 0) {
        let sql = 'INSERT OR IGNORE INTO Evaluation (id, name, course, min, max) VALUES ' + evaluations.map((x) => '(?,?,?,?,?)').join(',') + ';';
        let params = [].concat.apply([], evaluations.map((x) => [x['id'], x['name'],course['id'],x['min'],x['max']]));
        db.run(sql, params,
            function (err, result) {
                if (err) {
                    console.log(sql);
                    console.log(err);
                    console.trace();
                    return err;
                }
            }
        );

        sql = 'INSERT INTO Grade (value, student, evaluation) VALUES ' + grades.map((x) => '(?,?,?)').join(',') + ';';
        params = [].concat.apply([], grades.map((x) => [x['value'],x['student'], x['evaluation']]));
        db.run(sql, params,
            function (err, result) {
                if (err) {
                    console.log(sql);
                    console.log(err);
                    console.trace();
                    return err;
                }
            }
        );
    }
}
function load_students_to_db(students, course) {
    if (students.length > 0) {
        let sql = 'INSERT OR IGNORE INTO Student (id, name) VALUES ' + students.map((x) => '(?,?)').join(',') + ';';
        let params = [].concat.apply([], students.map((x) => [x['id'], x['name']]));
        db.run(sql, params,
            function (err, result) {
                if (err) {
                    console.log(sql);
                    console.log(err);
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
                    console.log(sql);
                    console.log(err);
                    console.trace();
                    return err;
                }
            }
        );
    }
}