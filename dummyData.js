const { db, delete_all_records_from_db } = require("./database.js");

module.exports = {
    createDummyData: createDummyData
};

function createDummyData() {
    delete_all_records_from_db();
    // Number Of Students
    let number_of_enrollements = (Math.random() * (26 - 20) + 20) * .9;
    let number_of_part_time = number_of_enrollements * .8;
    let number_of_full_time = number_of_enrollements * .2;
    let number_of_part_time_2_time = number_of_part_time * (1 - .1 - .23);

    let number_of_students_in_a_semester = number_of_part_time + number_of_full_time + number_of_part_time_2_time;

    let surnames = ["Quinta", "Barrico", "Cruz", "Neto", "Varão", "Robalo", "Mendes", "Quintana", "Rosário", "Chousa", "Ferrão", "Caminha", "Cisneiros", "Ulhoa", "Gama", "Figueiredo", "Letras", "Carrasco", "Alencar", "Carvalhal", "Botelho", "Pêcego", "Vidigal", "Baptista", "Silvestre", "Tabanez", "Ventura", "Figueira", "Malheiro", "Zagalo", "Espinosa", "Goulão", "Vides", "Monforte", "Calado", "Prestes", "Cabeça de Vaca", "Lameiras", "Mourão", "Meireles", "Imperial", "Camargo", "Proença", "Fiães", "Moreira", "Sales", "Lousã", "Saraiva", "Café", "Ximenes", "Parreir", "Veiga", "Casado", "Mariz", "Marinho", "Carvalho", "Vidal", "Valente", "Belchior", "Filipe", "Mainha", "Matos", "França", "Garcez", "Craveiro", "Marçal", "Urias", "Barata", "Azambuja", "Borja", "Fitas", "Calçada"];
    let names = ["Ryan", "Raúl", "Eliel", "Hayla", "Aida", "Teresa", "Imran", "Rute", "Adelaide", "Mickael", "Flora", "Aylla", "Serena", "Nuna", "Sílvia", "Mercês", "Sol", "Bárbara", "Angélico", "Kendra", "Samanta", "Victória", "Anderson", "Alexandro", "Kailany", "Andressa", "Dulce", "Emilie", "Pavel", "Camila", "Telmo", "Constança", "Luisa", "Avelino", "Enrique", "Jordan"];

    let students = [];
    for (let index = 0; index < number_of_students_in_a_semester; index++) {
        let name = names[Math.floor(Math.random() * names.length)] + " " + surnames[Math.floor(Math.random() * surnames.length)] + " " + surnames[Math.floor(Math.random() * surnames.length)];
        let student = { id: index, name: name };
        students.push(student);
    }
    let number_of_not_participating = number_of_students_in_a_semester * .1;
    let number_of_bad_students = number_of_students_in_a_semester * .23;

    // Shuffle array
    const shuffled = students.sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    let bad_students = shuffled.slice(0, number_of_bad_students);
    let no_students = shuffled.slice(number_of_bad_students, number_of_not_participating + number_of_bad_students);
    let good_students = shuffled.slice(number_of_not_participating + number_of_bad_students);

    let courses = [{ id: 22116, name: "Programação Web" }, { id: 22119, name: "Pesquisa e Recuperação de Informação" }, { id: 22120, name: "Realidade Virtual Distribuída" }, { id: 22121, name: "Sistemas Multiagente" }, { id: 22122, name: "Interação Humano-Computador" }, { id: 22124, name: "Extração do Conhecimento de Dados" }, { id: 22126, name: "Visualização de Informação" }, { id: 22129, name: "Elaboração da Dissertação" }, { id: 22130, name: "Heurísticas Modernas" }];

    const shuffled2 = students.sort(() => 0.5 - Math.random());
    let full_time = shuffled.slice(0, number_of_full_time);
    let part_time = shuffled.slice(number_of_full_time);
    let students_in_courses = [];

    for (let index = 0; index < full_time.length; index++) {
        const element = full_time[index];
        students_in_courses.push({ student: element.id, course: 22116 });
        students_in_courses.push({ student: element.id, course: 22122 });
        const shuffled_courses = courses.sort(() => 0.5 - Math.random());
        let i = 0;
        let end_while = 3;
        while (end_while) {
            while (shuffled_courses[i].id == 22116 || shuffled_courses[i].id == 22122) {
                i = i + 1;
            }
            students_in_courses.push({ student: element.id, course: shuffled_courses[i].id });
            i++;
            end_while--;
        }
    }

    for (let index = 0; index < part_time.length; index++) {
        const element = part_time[index];
        const shuffled_courses = courses.sort(() => 0.5 - Math.random());
        let i = 0;
        let end_while = Math.floor(Math.random() * (3 - 2) + 2);
        while (end_while > 0) {
            students_in_courses.push({ student: element.id, course: shuffled_courses[i].id });
            i++;
            end_while--;
        }
    }

    let phases = [{ course: 22116, start: 78.6, end: 104.8 }, { course: 22119, start: 16.375, end: 32.75 }, { course: 22119, start: 65.5, end: 81.875 }, { course: 22121, start: 26.2, end: 52.4 }, { course: 22121, start: 104.8, end: 131 }, { course: 22122, start: 0, end: 21.83333333 }, { course: 22122, start: 87.33333333, end: 109.1666667 }, { course: 22122, start: 109.1666667, end: 131 }, { course: 22124, start: 71.45454545, end: 83.36363636 }, { course: 22124, start: 119.0909091, end: 131 }, { course: 22120, start: 52.4, end: 78.6 }, { course: 22120, start: 78.6, end: 104.8 }, { course: 22121, start: 78.6, end: 104.8 }, { course: 22124, start: 11.90909091, end: 23.81818182 }, { course: 22124, start: 59.54545455, end: 71.45454545 }, { course: 22126, start: 0, end: 26.2 }, { course: 22126, start: 52.4, end: 78.6 }, { course: 22130, start: 65.5, end: 81.875 }, { course: 22116, start: 0, end: 26.2 }, { course: 22116, start: 52.4, end: 78.6 }, { course: 22116, start: 104.8, end: 131 }, { course: 22119, start: 49.125, end: 65.5 }, { course: 22119, start: 81.875, end: 98.25 }, { course: 22120, start: 0, end: 26.2 }, { course: 22121, start: 0, end: 26.2 }, { course: 22124, start: 0, end: 11.90909091 }, { course: 22130, start: 0, end: 16.375 }, { course: 22130, start: 114.625, end: 131 }, { course: 22119, start: 0, end: 16.375 }, { course: 22119, start: 114.625, end: 131 }, { course: 22120, start: 26.2, end: 52.4 }, { course: 22121, start: 52.4, end: 78.6 }, { course: 22122, start: 21.83333333, end: 43.66666667 }, { course: 22122, start: 43.66666667, end: 65.5 }, { course: 22122, start: 65.5, end: 87.33333333 }, { course: 22124, start: 23.81818182, end: 35.72727273 }, { course: 22124, start: 95.27272727, end: 107.1818182 }, { course: 22126, start: 104.8, end: 131 }, { course: 22130, start: 32.75, end: 49.125 }, { course: 22130, start: 49.125, end: 65.5 }, { course: 22116, start: 26.2, end: 52.4 }, { course: 22119, start: 32.75, end: 49.125 }, { course: 22119, start: 98.25, end: 114.625 }, { course: 22120, start: 104.8, end: 131 }, { course: 22124, start: 35.72727273, end: 47.63636364 }, { course: 22124, start: 47.63636364, end: 59.54545455 }, { course: 22124, start: 83.36363636, end: 95.27272727 }, { course: 22124, start: 107.1818182, end: 119.0909091 }, { course: 22126, start: 26.2, end: 52.4 }, { course: 22126, start: 78.6, end: 104.8 }, { course: 22130, start: 16.375, end: 32.75 }, { course: 22130, start: 81.875, end: 98.25 }, { course: 22130, start: 98.25, end: 114.625 }];


    let topics = [];
    let id_of_act = 0;
    phases.forEach(element => {
        let number_of_topics = Math.floor(Math.random() * (6 - 2) + 2);
        for (let index = 0; index < number_of_topics; index++) {
            let topic = { course: element.course, start: element.start, end: element.end, type: Math.floor(Math.random() * (6 - 1) + 1), id: id_of_act };
            topics.push(topic);
            id_of_act++;
        }

    });

    let posts = [];
    let attempts = [];
    let submissions = [];
    let forums = [];
    let quizzes = [];
    let assigns = [];
    let beginDate = new Date(2020, 9, 20, 0, 0, 0, 0); // 20 out 2020

    for (let index = 0; index < topics.length; index++) {
        let topic = topics[index];
        let DAY = Math.random() * (topic.end - topic.start + 1) + topic.start;
        good_students.forEach(element => {
            if (student_in_course(element.id, topic.course)) {
                if (Math.random() < 0.7) {
                    participate(element.id, topic, DAY);
                }
            }
        });
        bad_students.forEach(element => {
            if (student_in_course(element, topic.course)) {
                if (Math.random() > DAY / number_of_days) {
                    participate(element, topic, DAY);
                }
            }
        });

    }
    SeparedteTopics();

    //TODO: Evaluation activities
    //TODO load database
    let promise = new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("INSERT OR IGNORE INTO Student (id, name) VALUES " + students.map((x) => "(?,?)").join(',') + ";",
                [].concat.apply([], students.map((x) => [x['id'], x['name']])))
                .run('INSERT INTO Course (id, name) VALUES ' + courses.map((x) => '(?,?)').join(',') + ';',
                    [].concat.apply([], courses.map((x) => [x['id'], x['name']])))
                .run('INSERT INTO Student_in_Course (student, course, lastaccess) VALUES ' + students_in_courses.map((x) => '(?,?,?)').join(',') + ';',
                    [].concat.apply([], students_in_courses.map((x) => [x['student'], x['course'], x['lastaccess']])))
                .run('INSERT INTO Forum (id, course, due_date) VALUES ' + forums.map((x) => '(?,?,?)').join(',') + ';',
                    [].concat.apply([], forums.map((x) => [x['id'], x['course'], x['due_date']])))
                .run('INSERT INTO Assign (id, course, time_open, due_date) VALUES ' + assigns.map((x) => '(?,?,?,?)').join(',') + ';',
                    [].concat.apply([], assigns.map((x) => [x['id'], x['course'], x['time_open'], x['duedate']])))
                .run('INSERT INTO Quiz (id, course, attempts_permitted,time_open,time_close) VALUES ' + quizzes.map((x) => '(?,?,?,?,?)').join(',') + ';',
                    [].concat.apply([], quizzes.map((x) => [x['id'], x['course'], x['attempts'], x['time_open'], x['time_close']])))
                .run('INSERT INTO Post (student, forum, created, type) VALUES ' + posts.map((x) => '(?,?,?,?)').join(',') + ';',
                    [].concat.apply([], posts.map((x) => [x['student'], x['forum'], x['created'], x['type']])))
                .run('INSERT INTO Submission (student, assign, created) VALUES ' + submissions.map((x) => '(?,?,?)').join(',') + ';',
                    [].concat.apply([], submissions.map((x) => [x['student'], x['assign'], x['created']]))
                )
                .run('INSERT INTO Attempt (student, quiz, start, finish) VALUES ' + attempts.map((x) => '(?,?,?,?)').join(',') + ';',
                    [].concat.apply([], attempts.map((x) => [x['student'], x['quiz'], x['start'], x['finish']])));
            resolve(0);
            //.run(//EVALUATION).run(//GRADES).run().run().run();
        });

    });
    return promise;
    function participate(student, topic, day) {
        switch (topic.type) {
            case 1:
                let post = {
                    student: student,
                    forum: topic.id,
                    datecreated: Math.floor(Math.floor(beginDate.getTime() + day * 1000 * 60 * 60 * 24) / 1000),
                    type: Math.floor(Math.random() * 2)
                };
                posts.push(post);
                break;
            case 3:
                let quiz = {
                    student: student,
                    quiz: topic.id,
                    start: Math.floor(Math.floor(beginDate.getTime() + day * 1000 * 60 * 60 * 24) / 1000)
                };
                attempts.push(quiz);
                break;
            case 4:
                let subm = {
                    student: student,
                    assign: topic.id,
                    created: Math.floor(Math.floor(beginDate.getTime() + day * 1000 * 60 * 60 * 24) / 1000)
                };
                submissions.push(subm);
                break;
            default:
                //console.log("Other");
                break;
        }
    }
    function student_in_course(student, course) {
        for (let index = 0; index < students_in_courses.length; index++) {
            const e = students_in_courses[index];
            if (e.student == student && e.course == course) {
                return true;
            }
        }
        return false;
    }
    function SeparedteTopics() {
        for (let index = 0; index < topics.length; index++) {
            const element = topics[index];
            switch (element.type) {
                case 1:
                    forums.push({ id: element.id, course: element.course, duedate: Math.floor(Math.floor(beginDate.getTime() + element.end * 1000 * 60 * 60 * 24) / 1000) });
                    break;
                case 3:
                    quizzes.push({ id: element.id, course: element.course, attempts: Math.floor(Math.random() * 1.05), time_open: Math.floor(Math.floor(beginDate.getTime() + element.start * 1000 * 60 * 60 * 24) / 1000), time_close: Math.floor(Math.floor(beginDate.getTime() + element.end * 1000 * 60 * 60 * 24) / 1000) });
                    break;
                case 4:
                    assigns.push({ id: element.id, course: element.course, time_open: Math.floor(Math.floor(beginDate.getTime() + element.start * 1000 * 60 * 60 * 24) / 1000), due: Math.floor(Math.floor(beginDate.getTime() + element.end * 1000 * 60 * 60 * 24) / 1000) });
                    break;
                default:
                    break;
            }
        }
    }
}
