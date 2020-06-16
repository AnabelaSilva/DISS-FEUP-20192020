SELECT EVALUATION.name,
       STUDENT.name,
       COURSE.name,
       GRADE.value
  FROM GRADE
       JOIN
       EVALUATION ON (GRADE.evaluation = EVALUATION.id) 
       JOIN
       STUDENT ON (STUDENT.id = GRADE.student) 
       JOIN
       COURSE ON (EVALUATION.course = COURSE.id);

SELECT *
  FROM COURSE;

SELECT student,
       count(act),
       count(DISTINCT course) 
  FROM (
           SELECT STUDENT.id AS student,
                  created AS act
             FROM STUDENT
                  LEFT JOIN
                  POST ON (POST.student = STUDENT.id) 
           UNION ALL
           SELECT STUDENT.id AS student,
                  start AS act
             FROM STUDENT
                  LEFT JOIN
                  ATTEMPT ON (ATTEMPT.student = STUDENT.id) 
           UNION ALL
           SELECT STUDENT.id AS student,
                  created AS act
             FROM STUDENT
                  LEFT JOIN
                  SUBMISSION ON (SUBMISSION.student = STUDENT.id) 
       )
       JOIN
       STUDENT_IN_COURSE USING (
           student
       )
 GROUP BY student;

SELECT student,
       max(lastaccess) 
  FROM STUDENT_IN_COURSE
 GROUP BY student;

SELECT *
  FROM STUDENT;

SELECT number,
       count(created),
       count(DISTINCT course),
       STUDENT_IN_COURSE.student
  FROM WEEK
       JOIN
       STUDENT_IN_COURSE
       LEFT JOIN
       (
           SELECT created,
                  student
             FROM STUDENT
                  JOIN
                  POST ON (POST.student = STUDENT.id) 
           UNION ALL
           SELECT start,
                  student
             FROM STUDENT
                  JOIN
                  ATTEMPT ON (ATTEMPT.student = STUDENT.id) 
           UNION ALL
           SELECT created,
                  student
             FROM STUDENT
                  JOIN
                  SUBMISSION ON (SUBMISSION.student = STUDENT.id) 
       )
       AS tab1 ON (tab1.student = STUDENT_IN_COURSE.student AND 
                   number = ( (created - 1605830400) / 604800) ) 
 GROUP BY number,
          STUDENT_IN_COURSE.student;

SELECT STUDENT_IN_COURSE.student,
       count(DISTINCT FORUM.id),
       count(DISTINCT POST.forum) 
  FROM STUDENT_IN_COURSE
       JOIN
       FORUM USING (
           course
       )
       LEFT JOIN
       POST ON (FORUM.id = POST.forum AND 
                POST.student = STUDENT_IN_COURSE.student) 
 GROUP BY STUDENT_IN_COURSE.student;

SELECT STUDENT_IN_COURSE.student,
       count(DISTINCT QUIZ.id),
       count(DISTINCT ATTEMPT.quiz) 
  FROM STUDENT_IN_COURSE
       JOIN
       QUIZ USING (
           course
       )
       LEFT JOIN
       ATTEMPT ON (QUIZ.id = ATTEMPT.quiz AND 
                   ATTEMPT.student = STUDENT_IN_COURSE.student) 
 GROUP BY STUDENT_IN_COURSE.student;

SELECT STUDENT_IN_COURSE.student,
       count(DISTINCT ASSIGN.id),
       count(DISTINCT SUBMISSION.assign) 
  FROM STUDENT_IN_COURSE
       JOIN
       ASSIGN USING (
           course
       )
       LEFT JOIN
       SUBMISSION ON (ASSIGN.id = SUBMISSION.assign AND 
                      SUBMISSION.student = STUDENT_IN_COURSE.student) 
 GROUP BY STUDENT_IN_COURSE.student;

SELECT STUDENT_IN_COURSE.student,
       count(DISTINCT ASSIGN.id),
       count(DISTINCT assign) AS ONTIME
  FROM STUDENT_IN_COURSE
       JOIN
       ASSIGN USING (
           course
       )
       LEFT JOIN
       SUBMISSION ON (ASSIGN.id = SUBMISSION.assign AND 
                      SUBMISSION.student = STUDENT_IN_COURSE.student AND 
                      SUBMISSION.created <= ASSIGN.due_date) 
 GROUP BY STUDENT_IN_COURSE.student;

SELECT *
  FROM GRADE
       JOIN
       STUDENT ON (STUDENT.id = GRADE.student);

SELECT student,
       count(DISTINCT course),
       count(created) 
  FROM STUDENT_IN_COURSE
       LEFT JOIN
       POST USING (
           student
       )
 GROUP BY student;

SELECT student,
       count(DISTINCT course),
       count(start) 
  FROM STUDENT_IN_COURSE
       LEFT JOIN
       ATTEMPT USING (
           student
       )
 GROUP BY student;
 