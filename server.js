const express = require('express');
const app = express();


const dbFunc = require('./dbFunc.js');
let db = require("./database.js");
const queries = require('./queries.js');

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  let promises = [];
  promises.push(queries.get_activities_from_all_students());
  promises.push(queries.get_evaluations());
  Promise.all(promises).then((values) => {
    res.render('index', { title: 'Mestrado em Tecnologias e Sistemas Informáticos Web', histogram_data: values[0], box_data: values[1] });
  });

});

app.get('/student', (req, res) => {
  let promises = [];
  let student_id = Number(req.query.id);
  promises.push(queries.get_student(student_id));
  promises.push(queries.get_percentages(student_id));
  promises.push(queries.get_evaluations(student_id));
  promises.push(queries.get_courses(student_id));
  Promise.all(promises).then((values) => {
    res.render('student', { title: 'Mestrado em Tecnologias e Sistemas Informáticos Web', percentages_data: values[1], grades_data: values[2], students_courses: values[3]});
  });
});
app.get('/reload', (req, res) => {
  dbFunc.routeReload();
  // res.redirect('/');
  res.send('aaaa' + 404);
});

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});