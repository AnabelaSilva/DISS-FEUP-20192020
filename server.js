const express = require('express');
const app = express();
const load_ = require('./load_database.js');
var sqlite3 = require('sqlite3').verbose();


let db = require("./database.js");

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Homepage'
  });
});

app.get('/grades', (req, res) => {
  let sql = "SELECT CAST(((julianday(date) - julianday('2020-02-10 00:00:00'))/7) AS Integer) AS WeekNumber, count(student) AS Visitors, name, NumStudents FROM Activity JOIN Course ON(Course.id = Activity.course) JOIN (SELECT count(student) AS NumStudents, course FROM Student_in_Course Group by course)AS tab_1 ON(Course.id = tab_1.course)  GROUP BY Activity.course, WeekNumber;";
  let params = [];
  db.all(sql, params,
    function (err, rows) {
      if (err) {
        console.error(err);
        console.trace();
        return err;
      }
      let activity_by_course = rows;
      sql = "SELECT DaysSinceActivity, count(id) AS NumberOfStudents FROM(SELECT CAST(julianday('now') - julianday(max(date)) AS Integer) AS DaysSinceActivity, id FROM Student LEFT JOIN Activity ON (Student.id = Activity.student) GROUP BY student)GROUP By DaysSinceActivity;";
      db.all(sql, params,
        function (err, rows) {
          if (err) {
            console.error(err);
            console.trace();
            return err;
          }
          console.log(rows);
          res.render('show', { java: 'charts', data: activity_by_course, pieResults: rows});
        });
    }
  );
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
  load_.load_database();
  res.redirect('/');
});

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});