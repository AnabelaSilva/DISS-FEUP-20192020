const fetch = require('node-fetch');
const http = require("http");
const fs = require('fs');
const url = require('url');
const db = require("./database.js");

exports.load_database = function (req, res) {
    let url = new URL('http://localhost/webservice/rest/server.php');
    params = new URLSearchParams([
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
            //TODO: Continue
        });

    res.redirect('/');
}

function parse_list_of_courses(data) {
    let courses = [];
    data.forEach(element => {
        let course = { 'id': element.id, 'name': element.fullname };
        courses.push(course);
    });
    return courses;
}

function load_courses_to_db(courses) {
    let sql = 'INSERT INTO Course (id, name) VALUES ' + courses.map((x) => '(?,?)').join(',') + ';';
    let params = [].concat.apply([], courses.map((x) => [x['id'],x['name']]));
    console.log(params);
    db.run(sql, params,
        function (err, result) {
            if (err) {
                console.log(err)
                return err;
            }
        }
    );
}