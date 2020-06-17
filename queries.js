const { db } = require("./database.js");
const d3 = require('d3');
const percentRank = require('percentile-rank');

function get_activities_from_all_students() {
  let sql = queries_sql.percentage_of_activities_per_opportunities;
  let params = [];
  let promise = new Promise((resolve, reject) => {
    db.all(sql, params,
      function (err, rows) {
        if (err) {
          console.error(err);
          console.trace();
          return err;
        }
        let aux = [];
        rows.forEach(element => {
          aux.push(['' + element.student, 100.0 * element.participation / element.opportunities]);
        });
        resolve(aux);
      }
    );
  });
  return promise;
}

function get_evaluations(student_id) {
  let sql = queries_sql.grades;
  let params = [];
  let promise = new Promise((resolve, reject) => {
    db.all(sql, params,
      function (err, rows) {
        if (err) {
          console.error(err);
          console.trace();
          return err;
        }
        let aux = []
        rows.forEach(element => {
          if (aux[element.course_id] == undefined) {
            aux[element.course_id] = { course: element.course_name, evals: [] };
          }
          if (element.eval_id != null) {
            if (aux[element.course_id].evals[element.eval_id] == undefined) {
              aux[element.course_id].evals[element.eval_id] = { name: element.eval_name, data: [] };
            }
            if (element.value != null) {
              aux[element.course_id].evals[element.eval_id].data.push(element.value);
              if (student_id == element.student) {
                aux[element.course_id].evals[element.eval_id].grade = element.value;
              }
            }
          }
        });
        aux.forEach(course => {
          course.evals.forEach(element => {
            element.data.sort(function (a, b) { return a - b });
            element.min = d3.quantile(element.data, 0);
            element.Q1 = d3.quantile(element.data, 0.25);
            element.median = d3.quantile(element.data, 0.5);
            element.Q3 = d3.quantile(element.data, 0.75);
            element.max = d3.quantile(element.data, 1);
            if(element.grade != null){
              element.percentile = percentRank(element.data, element.grade);
            }
          });
        });
        resolve(aux);
      }
    );
  });
  return promise;
}

function get_percentages(student_id) {
  let sql = queries_sql.percentage_student_view;
  let params = [];
  let promise = new Promise((resolve, reject) => {
    db.all(sql, params,
      function (err, rows) {
        if (err) {
          console.error(err);
          console.trace();
          return err;
        }
        let res = [
          ['Participated Forums'],
          ['Attempted Quizzes'],
          ['Submitted Assignments'],
          ['OnTime Submissions']
        ];
        let aux = [[], [], [], []];
        rows.forEach(element => {
          aux[0].push(100.0 * element.participated_forums / element.available_forums);
          aux[1].push(100.0 * element.participated_quizzes / element.available_quizzes);
          aux[2].push(100.0 * element.participated_assigns / element.available_assigns);
          aux[3].push(100.0 * element.ontime_submissions / element.assigns);
          if (element.student == student_id) {
            res[0].push(100.0 * element.participated_forums / element.available_forums);
            res[1].push(100.0 * element.participated_quizzes / element.available_quizzes);
            res[2].push(100.0 * element.participated_assigns / element.available_assigns);
            res[3].push(100.0 * element.ontime_submissions / element.assigns);
          }
        });
        for (let index = 0; index < aux.length; index++) {
          const element = aux[index];
          element.sort(function (a, b) { return a - b });
          res[index].push(d3.quantile(element, 0));
          res[index].push(d3.quantile(element, 0.25));
          res[index].push(d3.quantile(element, 0.5));
          res[index].push(d3.quantile(element, 0.75));
          res[index].push(d3.quantile(element, 1));
        }
        resolve(res);
      }
    );
  });
  return promise;
}
function get_student(student_id) {
  let sql = queries_sql.get_student;
  let params = [student_id];
  let promise = new Promise((resolve, reject) => {
    db.get(sql, params,
      function (err, row) {
        if (err) {
          console.error(err);
          console.trace();
          return err;
        }
        resolve(row);
      }
    );
  });
  return promise;
}
function get_courses(student_id) {
  let sql = queries_sql.get_courses;
  let params = [student_id];
  let promise = new Promise((resolve, reject) => {
    db.all(sql, params,
      function (err, row) {
        if (err) {
          console.error(err);
          console.trace();
          return err;
        }
        resolve(row);
      }
    );
  });
  return promise;
}

module.exports = {
  get_activities_from_all_students: get_activities_from_all_students,
  get_evaluations: get_evaluations,
  get_percentages: get_percentages,
  get_student: get_student,
  get_courses:get_courses
};

let queries_sql = {
  get_student: "SELECT * FROM STUDENT WHERE id = ?;",
  get_courses: "SELECT * FROM STUDENT_IN_COURSE WHERE student = ?;",
  percentage_of_activities_per_opportunities: "SELECT student, f + q + ag AS opportunities, p + at + s AS participation FROM ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT FORUM.id) AS f, count(DISTINCT POST.forum) AS p FROM STUDENT_IN_COURSE JOIN FORUM USING ( course ) LEFT JOIN POST ON (FORUM.id = POST.forum AND POST.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab1 JOIN ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT QUIZ.id) AS q, count(DISTINCT ATTEMPT.quiz) AS at FROM STUDENT_IN_COURSE JOIN QUIZ USING ( course ) LEFT JOIN ATTEMPT ON (QUIZ.id = ATTEMPT.quiz AND ATTEMPT.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab2 USING ( student ) JOIN ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT ASSIGN.id) AS ag, count(DISTINCT SUBMISSION.assign) AS s FROM STUDENT_IN_COURSE JOIN ASSIGN USING ( course ) LEFT JOIN SUBMISSION ON (ASSIGN.id = SUBMISSION.assign AND SUBMISSION.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab3 USING ( student );",
  grades: "SELECT COURSE.name AS course_name, COURSE.id AS course_id, STUDENT_IN_COURSE.student AS student, EVALUATION.id AS eval_id, EVALUATION.name AS eval_name, value FROM STUDENT_IN_COURSE LEFT JOIN EVALUATION USING ( course ) LEFT JOIN GRADE ON (GRADE.evaluation = EVALUATION.id AND STUDENT_IN_COURSE.student = GRADE.student) JOIN COURSE ON (STUDENT_IN_COURSE.course = COURSE.id) ;",
  percentage_student_view: "SELECT student, available_forums, participated_forums, available_quizzes, participated_quizzes, available_assigns, participated_assigns, assigns, ontime_submissions FROM ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT FORUM.id) AS available_forums, count(DISTINCT POST.forum) AS participated_forums FROM STUDENT_IN_COURSE JOIN FORUM USING ( course ) LEFT JOIN POST ON (FORUM.id = POST.forum AND POST.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab1 JOIN ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT QUIZ.id) AS available_quizzes, count(DISTINCT ATTEMPT.quiz) AS participated_quizzes FROM STUDENT_IN_COURSE JOIN QUIZ USING ( course ) LEFT JOIN ATTEMPT ON (QUIZ.id = ATTEMPT.quiz AND ATTEMPT.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab2 USING ( student ) JOIN ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT ASSIGN.id) AS available_assigns, count(DISTINCT SUBMISSION.assign) AS participated_assigns FROM STUDENT_IN_COURSE JOIN ASSIGN USING ( course ) LEFT JOIN SUBMISSION ON (ASSIGN.id = SUBMISSION.assign AND SUBMISSION.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab3 USING ( student ) JOIN ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT ASSIGN.id) AS assigns, count(DISTINCT assign) AS ontime_submissions FROM STUDENT_IN_COURSE JOIN ASSIGN USING ( course ) LEFT JOIN SUBMISSION ON (ASSIGN.id = SUBMISSION.assign AND SUBMISSION.student = STUDENT_IN_COURSE.student AND SUBMISSION.created <= ASSIGN.due_date) GROUP BY STUDENT_IN_COURSE.student ) AS tab4 USING ( student );"
};