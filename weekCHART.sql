SELECT * FROM (
SELECT week,
       student,
       open_quizzes,
       closed_quizzes,
       done_quizzes
  FROM (
           SELECT number AS week,
                  student,
                  count(DISTINCT QUIZ.id) AS open_quizzes
             FROM WEEK
                  JOIN
                  STUDENT_IN_COURSE
                  LEFT JOIN
                  QUIZ ON (STUDENT_IN_COURSE.course = QUIZ.course AND 
                           number >= (time_open - 1602284400) / 604800 AND 
                           number < (time_close - 1602284400) / 604800) 
            GROUP BY number,
                     STUDENT_IN_COURSE.student
       )
       AS tab1
       JOIN
       (
           SELECT number AS week,
                  student,
                  count(DISTINCT QUIZ.id) AS closed_quizzes
             FROM WEEK
                  JOIN
                  STUDENT_IN_COURSE
                  LEFT JOIN
                  QUIZ ON (STUDENT_IN_COURSE.course = QUIZ.course AND 
                           number >= (time_close - 1602284400) / 604800) 
            GROUP BY number,
                     STUDENT_IN_COURSE.student
       )
       AS tab2 USING (
           week,
           student
       )
       JOIN
       (
           SELECT number AS week,
                  STUDENT_IN_COURSE.student,
                  count(DISTINCT ATTEMPT.quiz) AS done_quizzes
             FROM WEEK
                  JOIN
                  STUDENT_IN_COURSE
                  LEFT JOIN
                  ATTEMPT ON (number >= (start - 1602284400) / 604800 AND STUDENT_IN_COURSE.student = ATTEMPT.student) 
            GROUP BY number,
                     STUDENT_IN_COURSE.student
       )
       AS tab3 USING (
           week,
           student
       ) ) AS quiz_week JOIN (SELECT week,
       student,
       open_assigns,
       closed_assigns,
       done_assigns
  FROM (
           SELECT number AS week,
                  student,
                  count(DISTINCT ASSIGN.id) AS open_assigns
             FROM WEEK
                  JOIN
                  STUDENT_IN_COURSE
                  LEFT JOIN
                  ASSIGN ON (STUDENT_IN_COURSE.course = ASSIGN.course AND 
                           number >= (time_open - 1602284400) / 604800 AND 
                           number < (due_date - 1602284400) / 604800) 
            GROUP BY number,
                     STUDENT_IN_COURSE.student
       )
       AS tab1
       JOIN
       (
           SELECT number AS week,
                  student,
                  count(DISTINCT ASSIGN.id) AS closed_assigns
             FROM WEEK
                  JOIN
                  STUDENT_IN_COURSE
                  LEFT JOIN
                  ASSIGN ON (STUDENT_IN_COURSE.course = ASSIGN.course AND 
                           number >= (due_date - 1602284400) / 604800) 
            GROUP BY number,
                     STUDENT_IN_COURSE.student
       )
       AS tab2 USING (
           week,
           student
       )
       JOIN
       (
           SELECT number AS week,
                  STUDENT_IN_COURSE.student,
                  count(DISTINCT SUBMISSION.assign) AS done_assigns
             FROM WEEK
                  JOIN
                  STUDENT_IN_COURSE
                  LEFT JOIN
                  SUBMISSION ON (number >= (created - 1602284400) / 604800 AND STUDENT_IN_COURSE.student = SUBMISSION.student) 
            GROUP BY number,
                     STUDENT_IN_COURSE.student
       )
       AS tab3 USING (
           week,
           student
       )) AS assign_week USING (
           week,
           student
       )


