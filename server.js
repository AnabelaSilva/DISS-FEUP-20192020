const express = require('express');
const app = express();
const load_ = require('./load_database.js');

const db = require("./database.js");

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
            console.log(rows);
            res.render('show',{data: rows});
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