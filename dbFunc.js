const fetch = require('node-fetch');

const { db, delete_all_records_from_db } = require("./database.js");


const url = new URL('http://localhost/webservice/rest/server.php');
const params = new URLSearchParams([
    ['wstoken', 'a369f680e3cb5fab20997372ed53d1e1'],
    ['moodlewsrestformat', 'json']
]);
var userid;
const STUDENT_ROLE_ID = 5;
function load_database() {
    delete_all_records_from_db();
    params.set('wsfunction', 'core_webservice_get_site_info');
    url.search = params;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            userid = data.userid;
            fetch_courses(userid);
        });
}

function fetch_courses(userid) {
    params.set('wsfunction', 'core_enrol_get_users_courses');
    params.set('userid', userid);
    url.search = params;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            params.delete('userid');
            let courses = parse_list_of_courses(data);
            load_courses_to_db(courses);
            fetch_students(courses);
        });
}
function fetch_students(courses) {
    params.set('wsfunction', 'core_enrol_get_enrolled_users');
    courses.forEach(element => {
        params.set('courseid', element['id']);
        url.search = params;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let students = parse_list_of_students(data);
                load_students_to_db(students, element);
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

        sql = 'INSERT INTO Student_in_Course (student, course, lastaccess) VALUES ' + students.map((x) => '(?,?,?)').join(',') + ';';
        params = [].concat.apply([], students.map((x) => [x['id'], course['id'], x['lastaccess']]));
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
        let student = { 'id': element.id, 'name': element.fullname, 'lastaccess': element.lastcourseaccess == 0 ? null : element.lastcourseaccess };
        if (undefined != element['roles'].find(el => el['roleid'] == STUDENT_ROLE_ID)) {
            students.push(student);
        }
    });
    return students;
}
module.exports = {
    routeReload: load_database
};
