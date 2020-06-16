DELETE FROM POST;
DELETE FROM FORUM;
DELETE FROM SUBMISSION;
DELETE FROM ASSIGN;
DELETE FROM ATTEMPT;
DELETE FROM QUIZ;
DELETE FROM GRADE;
DELETE FROM EVALUATION;
DELETE FROM STUDENT_IN_COURSE;
DELETE FROM STUDENT;
DELETE FROM COURSE;

INSERT INTO COURSE (id, name) VALUES 
(22116, 'Programação Web'),
(22122, 'Interação Humano-Computador'),
(22119, 'Pesquisa e Recuperação de Informação'),
(22120, 'Realidade Virtual Distribuída'),
(22130, 'Heurísticas Modernas'),
(22121, 'Sistemas Multiagente'),
(22124, 'Extração do Conhecimento de Dados'),
(22126, 'Visualização de Informação'),
(22129, 'Elaboração da Dissertação');

INSERT INTO STUDENT (name,id) VALUES 
("Pearl Wright",1),("Marshall Spears",2),("Nayda J. Fuller",3),("Kaye D. Kim",4),("Kenneth W. Shelton",5),("Duncan Wooten",6),("Mia X. Palmer",7),("Harriet Massey",8),("Keelie P. Griffin",9),("Beck Farley",10),("Avram Chapman",11),("James Bridges",12),("Florence Neal",13),("Forrest Townsend",14),("Declan K. Holland",15),("Xerxes Rich",16),("Scott Sargent",17),("Dominic Mcguire",18),("Stewart Le",19),("Emery Y. Rosales",20),("Kalia Z. Kinney",21),("Kalia Mcguire",22),("Adrienne Carney",23),("Kaden Shannon",24),("Gregory Hull",25),("Gretchen Crane",26),("Graiden Bishop",27),("Kalia Schultz",28),("Shana G. French",29),("Emily E. West",30),("Lynn T. Riley",31);

-- Student_in_Course
-- Forum
-- Quiz
-- Assign
-- post
-- attempt
-- submission