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
 WHERE STUDENT_IN_COURSE.student = 1;-- GET Percentage forum participated

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
 GROUP BY STUDENT_IN_COURSE.student;-- GET Percentage Quiz participated

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
 GROUP BY STUDENT_IN_COURSE.student;-- GET Percentage assign participated

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
 GROUP BY STUDENT_IN_COURSE.student;-- ON TIME ASSIGN

SELECT STUDENT_IN_COURSE.student,
       count(DISTINCT ASSIGN.id) AS ONTIME
  FROM STUDENT_IN_COURSE
       JOIN
       ASSIGN USING (
           course
       )
       LEFT JOIN
       SUBMISSION ON (ASSIGN.id = SUBMISSION.assign AND 
                      SUBMISSION.student = STUDENT_IN_COURSE.student) 
 WHERE (SUBMISSION.created <= ASSIGN.due_date) 
 GROUP BY STUDENT_IN_COURSE.student;-- Number of attempts per quiz

SELECT STUDENT_IN_COURSE.student,
       count(DISTINCT QUIZ.id),
       count(ATTEMPT.quiz) 
  FROM STUDENT_IN_COURSE
       JOIN
       QUIZ USING (
           course
       )
       LEFT JOIN
       ATTEMPT ON (QUIZ.id = ATTEMPT.quiz AND 
                   ATTEMPT.student = STUDENT_IN_COURSE.student) 
 GROUP BY STUDENT_IN_COURSE.student;-- - TIME SERIES

SELECT (created - 1605830400) / 604800 AS WeekNumber,
       count() 
  FROM (
           SELECT created
             FROM STUDENT
                  JOIN
                  POST ON (POST.student = STUDENT.id)-- WHERE STUDENT.id = 1 
           UNION ALL
           SELECT start
             FROM STUDENT
                  JOIN
                  ATTEMPT ON (ATTEMPT.student = STUDENT.id)-- WHERE STUDENT.id = 1 
           UNION ALL
           SELECT created
             FROM STUDENT
                  JOIN
                  SUBMISSION ON (SUBMISSION.student = STUDENT.id)-- WHERE STUDENT.id = 1 
       )
 GROUP BY WeekNumber;

SELECT datetime(1605830400, 'unixepoch');

SELECT *
  FROM GRADE
       JOIN
       STUDENT ON (STUDENT.id = GRADE.student);


SELECT student, count(), count(DISTINCT course)
  FROM (
           SELECT student, created
             FROM STUDENT
                  JOIN
                  POST ON (POST.student = STUDENT.id)-- WHERE STUDENT.id = 1 
           UNION ALL
           SELECT student, start
             FROM STUDENT
                  JOIN
                  ATTEMPT ON (ATTEMPT.student = STUDENT.id)-- WHERE STUDENT.id = 1 
           UNION ALL
           SELECT student, created
             FROM STUDENT
                  JOIN
                  SUBMISSION ON (SUBMISSION.student = STUDENT.id)-- WHERE STUDENT.id = 1 
       ) JOIN STUDENT_IN_COURSE USING (student)
       GROUP BY student;
SELECT student,  max(created)
  FROM (
           SELECT student, created
             FROM STUDENT
                  JOIN
                  POST ON (POST.student = STUDENT.id)-- WHERE STUDENT.id = 1 
           UNION ALL
           SELECT student, start
             FROM STUDENT
                  JOIN
                  ATTEMPT ON (ATTEMPT.student = STUDENT.id)-- WHERE STUDENT.id = 1 
           UNION ALL
           SELECT student, created
             FROM STUDENT
                  JOIN
                  SUBMISSION ON (SUBMISSION.student = STUDENT.id)-- WHERE STUDENT.id = 1 
        )GROUP BY student;
SELECT student,
       max(lastaccess) 
  FROM STUDENT_IN_COURSE
 GROUP BY student;
;