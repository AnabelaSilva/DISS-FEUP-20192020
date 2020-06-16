const {db} = require("./database.js");

function get_activities_from_all_students() {
  let sql = queries_sql.percentage_of_activities_per_opportunities;
  let params = [];
  db.all(sql, params,
    function (err, rows) {
      if (err) {
        console.error(err);
        console.trace();
        return err;
      }
      console.log(rows);
    }
  );
  return;
}

module.exports = {
  get_activities_from_all_students: get_activities_from_all_students
};


let queries_sql = {
  percentage_of_activities_per_opportunities: "SELECT student, f + q + ag AS Opportunities, p + at + s AS Participation FROM ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT FORUM.id) AS f, count(DISTINCT POST.forum) AS p FROM STUDENT_IN_COURSE JOIN FORUM USING ( course ) LEFT JOIN POST ON (FORUM.id = POST.forum AND POST.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab1 JOIN ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT QUIZ.id) AS q, count(DISTINCT ATTEMPT.quiz) AS at FROM STUDENT_IN_COURSE JOIN QUIZ USING ( course ) LEFT JOIN ATTEMPT ON (QUIZ.id = ATTEMPT.quiz AND ATTEMPT.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab2 USING ( student ) JOIN ( SELECT STUDENT_IN_COURSE.student, count(DISTINCT ASSIGN.id) AS ag, count(DISTINCT SUBMISSION.assign) AS s FROM STUDENT_IN_COURSE JOIN ASSIGN USING ( course ) LEFT JOIN SUBMISSION ON (ASSIGN.id = SUBMISSION.assign AND SUBMISSION.student = STUDENT_IN_COURSE.student) GROUP BY STUDENT_IN_COURSE.student ) AS tab3 USING ( student );"
};