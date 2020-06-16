const { db } = require("./database.js");
const d3 = require('d3');
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

function get_evaluations() {
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
            }
          }
        });
        aux.forEach(course => {
          course.evals.forEach(element => {
            element.data.sort(function (a, b) { return a - b });
            element.min =  d3.quantile(element.data, 0);
            element.Q1 = d3.quantile(element.data, 0.25);
            element.median = d3.quantile(element.data, 0.5);
            element.Q3 = d3.quantile(element.data, 0.75);
            element.max = d3.quantile(element.data, 1);
          });
        });
        resolve(aux);
      }
    );
  });
  return promise;
}

module.exports = {
  get_activities_from_all_students: get_activities_from_all_students,
  get_evaluations: get_evaluations
};

let queries_sql = {
  percentage_of_activities_per_opportunities: "SELECT student, f + q + ag AS opportunities, p + at + s AS participation FROM ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT FORUM.id) AS f, count(DISTINCT POST.forum) AS p FROM STUDENT_IN_COURSE JOIN FORUM USING ( course ) LEFT JOIN POST ON (FORUM.id = POST.forum AND POST.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab1 JOIN ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT QUIZ.id) AS q, count(DISTINCT ATTEMPT.quiz) AS at FROM STUDENT_IN_COURSE JOIN QUIZ USING ( course ) LEFT JOIN ATTEMPT ON (QUIZ.id = ATTEMPT.quiz AND ATTEMPT.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab2 USING ( student ) JOIN ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT ASSIGN.id) AS ag, count(DISTINCT SUBMISSION.assign) AS s FROM STUDENT_IN_COURSE JOIN ASSIGN USING ( course ) LEFT JOIN SUBMISSION ON (ASSIGN.id = SUBMISSION.assign AND SUBMISSION.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab3 USING ( student );",
  grades: "SELECT COURSE.name AS course_name, COURSE.id AS course_id, STUDENT_IN_COURSE.student AS student, EVALUATION.id AS eval_id, EVALUATION.name AS eval_name, value FROM STUDENT_IN_COURSE LEFT JOIN EVALUATION USING ( course ) LEFT JOIN GRADE ON (GRADE.evaluation = EVALUATION.id AND STUDENT_IN_COURSE.student = GRADE.student) JOIN COURSE ON (STUDENT_IN_COURSE.course = COURSE.id) ;"
};