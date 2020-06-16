const express = require('express');
const app = express();


const dbFunc = require('./dbFunc.js');
let db = require("./database.js");
const queries = require('./queries.js');

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  
  let act = queries.get_activities_from_all_students();
  console.log(act);
  res.render('index', { title: 'Mestrado em Tecnologias e Sistemas Informáticos Web'});
});


app.get('/student', (req, res) => {
  let sql = "SELECT Student.name AS StudentName, Course.name AS CourseName, Evaluation.name AS EvaluationName, value FROM Student JOIN Student_in_Course ON (Student.id = Student_in_Course.student)  JOIN Grade ON (Student.id = Grade.student)  JOIN Evaluation ON (Grade.evaluation = Evaluation.id AND Evaluation.course = Student_in_Course.course)  JOIN Course ON (Course.id = Student_in_Course.course) WHERE Student.id = ? ORDER BY Course.id;";
  let params = [parseInt(req.query.id)];
  let dt = [];
  let rs = [];
  db.all(sql, params,
    function (err, rows) {
      if (err) {
        console.error(err);
        console.trace();
        return err;
      }
      dt = rows;
      let sql1 = "SELECT CAST(((julianday(date) - julianday('2020-02-10 00:00:00'))/7) AS Integer) AS WeekNumber, name, count(date) AS Visits FROM Activity JOIN Course ON(Course.id = Activity.course) JOIN (SELECT count(student) AS NumStudents, course FROM Student_in_Course Group by course) AS tab_1 ON(Course.id = tab_1.course) WHERE student = ?GROUP BY Activity.course, WeekNumber;";
      db.all(sql1, params,
        function (err, rows) {
          if (err) {
            console.error(err);
            console.trace();
            return err;
          }
          rs = rows;
          res.render('student', { java: 'student', rows: dt, data: rs });
        }
      );
    }
  );
});
app.get('/reload', (req, res) => {
  dbFunc.routeReload();
  // res.redirect('/');
  res.send('aaaa' + 404);
});

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});