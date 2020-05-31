SELECT CAST(((julianday(date) - julianday('2020-02-10 00:00:00'))/7) AS Integer) AS WeekNumber, count(student) AS Visitors, name, NumStudents
FROM Activity 
JOIN Course ON(Course.id = Activity.course)
JOIN (SELECT count(student) AS NumStudents, course FROM Student_in_Course Group by course)AS tab_1 ON(Course.id = tab_1.course)
GROUP BY Activity.course, WeekNumber;