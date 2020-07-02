const express = require('express');
const app = express();


const dbFunc = require('./dbFunc.js');
let db = require("./database.js");
const queries = require('./queries.js');
const dummy = require('./dummyData.js');

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  let promises = [];
  promises.push(queries.get_activities_from_all_students());
  promises.push(queries.get_evaluations());
  promises.push(queries.get_lastAccess());
  promises.push(queries.get_activities_from_courses());
  Promise.all(promises).then((values) => {
    res.render('index', { title: 'Mestrado em Tecnologias e Sistemas Informáticos Web', histogram_data: values[0], box_data: values[1], last_access: values[2], participation_by_course: values[3] });
  });

});
app.get('/student', (req, res) => {
  let promises = [];
  let student_id = Number(req.query.id);
  promises.push(queries.get_student(student_id));
  promises.push(queries.get_percentages(student_id));
  promises.push(queries.get_evaluations(student_id));
  promises.push(queries.get_courses(student_id));
  promises.push(queries.get_activities_in_time(student_id));
  promises.push(queries.get_indicators(student_id));
  promises.push(queries.get_timeline_of_activities_done(student_id));
  Promise.all(promises).then((values) => {
    res.render('student', { title: 'Mestrado em Tecnologias e Sistemas Informáticos Web', student: values[0], percentages_data: values[1], grades_data: values[2], students_courses: values[3], weekly_activities: values[4], indicators: values[5], timeline_info: values[6] });
  });
});

app.get('/course', (req, res) => {
  let promises = [];
  let course_id = Number(req.query.id);
  promises.push(queries.get_course(course_id));
  Promise.all(promises).then((values) => {
    res.render('course', { title: 'Mestrado em Tecnologias e Sistemas Informáticos Web', course: values[0]});
  });
});

app.get('/reload', (req, res) => {
  dbFunc.routeReload().then((v) => {
    // res.redirect('/');
    console.log("ACABOU");
    res.send('aaaa' + 404);
  })
});
app.get('/dummy', (req, res) => {
  dummy.createDummyData().then((v) => {
    res.redirect('/');
  });
});

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});