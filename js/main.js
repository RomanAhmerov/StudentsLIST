(() => {
    document.addEventListener('DOMContentLoaded', () => {
    
// Article (check-in) форма для добавления студента в список
        // Ограничения по дате для формы регистрации студента
        // Текущая дата
        const nowDate = new Date();
        // Ограничение даты рождения
        const birthday = document.getElementById('birthday');
        
        birthday.max = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}-${String(nowDate.getDate()).padStart(2, '0')}`;

        // Ограничение и создание дат начала обучения
        const startDateSelect = document.getElementById('start-date');

        for (let i = 2000; i <= nowDate.getFullYear(); i++) {
            let optionSelect = document.createElement('option');
            optionSelect.value = i;
            optionSelect.textContent = i;
            startDateSelect.append(optionSelect);           
        };

        // Создание массива студентов
        let students = [];

        // Если в списке уже есть студенты, то переприсваеваем массив
        if (JSON.parse(localStorage.getItem('studentsDB'))) {
            students = JSON.parse(localStorage.getItem('studentsDB'));
        };

        const lastName = document.getElementById('last-name');
        const firstName = document.getElementById('first-name');
        const middleName = document.getElementById('middle-name');
        const faculty = document.getElementById('faculty');
        const studentAdded = document.querySelector('.student-added');

        // Добавление студента в список
        const form = document.querySelector('.form__check-in');
        // Обработчик события (отправить)
        form.addEventListener('submit', (evt) => {
            // Предотвращение перезагрузки страницы браузера
            evt.preventDefault();

            // Присвоение индекса (номера) студентам
            let lastItemArray = 0

            if (students.length) {
                lastItemArray = students.length;
            };

            // Создание объекта с информацией об студенте
            const student = {
                'indexStudent': lastItemArray + 1,
                'lastName': lastName.value.trim(),
                'firstName': firstName.value.trim(),
                'middleName': middleName.value.trim(),
                'birthday': new Date(birthday.value),
                'faculty': faculty.value.trim(),
                'startDate': startDateSelect.value.trim()
            };

            // Добавление данных студента в массив
            students.push(student);

            // Добавление массива объектов в localStorage для хранения данных
            localStorage.setItem('studentsDB', JSON.stringify(students));

            // Обнуление значений формы
            lastName.value = '';
            firstName.value = '';
            middleName.value = '';
            birthday.value = '';
            faculty.value = '';
            startDateSelect.value = '';


            // Уведомление об успешном добавлении студента
            studentAdded.classList.toggle('d-none');

            setTimeout(() => {
                studentAdded.classList.toggle('d-none');
            }, 3500);
        });



// Header Кнопки переключение экрана (список студентов / добавление студента)
        const btnStudentsList = document.querySelector('.btn__students-list');
        const btnCheckInStudent = document.querySelector('.btn__check-in-student');
        const wrapperStudentsList = document.querySelector('.wrapper__students-list');
        const wrapperCheckInStudent = document.querySelector('.check-in');

        // Работа с кнопками (список студентов / добавление студента)
        btnStudentsList.addEventListener('click', () => {
            if (wrapperStudentsList.classList.contains('d-none')) {
                wrapperStudentsList.classList.remove('d-none');

                wrapperCheckInStudent.classList.add('d-none');
            };
        });

        btnCheckInStudent.addEventListener('click', () => {
            if (wrapperCheckInStudent.classList.contains('d-none')) {
                wrapperCheckInStudent.classList.remove('d-none');

                wrapperStudentsList.classList.add('d-none');
            };
        });



// Article (students-list) список студентов
            // Переменные для дальнейшей работы
            const tableBody = document.querySelector('.tbody__students-list');

            // Массив списка студетов
            let studentsListArray = [];

            // Получение массива списка студентов
            if (JSON.parse(localStorage.getItem('studentsDB'))) {
                studentsListArray = JSON.parse(localStorage.getItem('studentsDB'));
            };

        // Создание элементов таблицы  
            /**
             * Данная функция создает список студентов и образовывает из него таблицу
             * @param array Входной параметр массив студентов 
             */
            function createStudentsList (studentsArray) {
                studentsArray.forEach(student => {
                // Создание DOM элементов
                    const tableRow = document.createElement('tr');
                    const numberStudent = document.createElement('th');
                    const nameStudent = document.createElement('td');
                    const birthdayStudent = document.createElement('td');
                    const facultyStudent = document.createElement('td');
                    const startDateStudent = document.createElement('td');


                // Работа с возрастом студента
                    // Создание массива дня рождения студента
                    const dateAgeArray = student.birthday.slice(0, student.birthday.indexOf('T')).split('-').reverse();

                    // Определение количества полных лет
                    let studentAge = 0;

                    if (nowDate.getDate() < Number(dateAgeArray[0]) && (nowDate.getMonth() + 1) <= Number(dateAgeArray[1])) {
                        studentAge = nowDate.getFullYear() - Number(dateAgeArray[2]) - 1;
                    } else {
                        studentAge = nowDate.getFullYear() - Number(dateAgeArray[2]);
                    }

                    // Определение какое именно слово должно использозваться после возраста (год/года/лет)
                    const dobleLastElementAge = String(studentAge).substring(String(studentAge).length - 2);
                    const lastElementAge = String(studentAge).substring(String(studentAge).length - 1);
                    let ending = '';

                    if (
                        dobleLastElementAge == 11 ||
                        dobleLastElementAge == 12 ||
                        dobleLastElementAge == 13 ||
                        dobleLastElementAge == 14
                    ) {
                        ending = 'лет';

                    } else if (lastElementAge == 1) {
                        ending = 'год';

                    } else if (
                        lastElementAge == 2 ||
                        lastElementAge == 3 ||
                        lastElementAge == 4 
                    ) {
                        ending = 'года';

                    } else {
                        ending = 'лет';
                    };
                

                // Работа со сроком обучения
                    let courseCount = '';

                    if (nowDate.getFullYear() - Number(student.startDate) > 4) {
                        courseCount = '(закончил)';

                    } else if (nowDate.getFullYear() - Number(student.startDate) == 0) {
                        courseCount = '(1 курс)';

                    } else {
                        courseCount = `(${nowDate.getFullYear() - Number(student.startDate)} курс)`;
                    };


                // Вставка данных в таблицу (ввод контента)
                    numberStudent.textContent = `${student.indexStudent}`;
                    nameStudent.textContent = `${student.lastName} ${student.firstName} ${student.middleName}`;
                    birthdayStudent.textContent = `${dateAgeArray.join('.')} (${studentAge} ${ending})`;
                    facultyStudent.textContent = `${student.faculty}`;
                    startDateStudent.textContent = `${student.startDate}-${Number(student.startDate) + 4} ${courseCount}`;
                    
                // Добавление элементов в DOM дерево
                    tableRow.append(numberStudent, nameStudent, birthdayStudent, facultyStudent, startDateStudent);
                    tableBody.append(tableRow);
                });
            };


// Создание таблицы
            const tableList = document.querySelector('.table__students-list');
            const alertStudentsList = document.querySelector('.alert__students-list');

            // Выполнение функции (создание таблицы студентов)
            if (studentsListArray.length) {
                createStudentsList(studentsListArray);

            } else {
                // Ситуация при которой список студентов пустой
                alertStudentsList.classList.remove('d-none')
                tableList.classList.add('d-none');
            };

// Сортировка списка студента
            const sortNumberStudent = document.querySelector('.number-student');
            const sortFullName = document.querySelector('.fullname');
            const sortBirthday = document.querySelector('.birthday');
            const sortFaculty = document.querySelector('.faculty');
            const sortStartDate = document.querySelector('.start-date');

            // Сортировка по времени добавления
            let ascNumberStudent = false;

            sortNumberStudent.addEventListener('click', () => {
                if (!ascNumberStudent) {
                    studentsListArray.sort((a, b) => a.indexStudent - b.indexStudent);
                    ascNumberStudent = true;

                } else {
                    studentsListArray.sort((a, b) => b.indexStudent - a.indexStudent);
                    ascNumberStudent = false;
                };

                // Удаление всех строк в таблице
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                };
                
                // Добавление новых строк в таблицу
                createStudentsList(studentsListArray);
            });


            // Сортировка по ФИО
            let ascFullName = false;

            sortFullName.addEventListener('click', () => {

                if (!ascFullName) {
                    studentsListArray.sort((a, b) => {
                        const firstStudentName = `${a.lastName} ${a.firstName} ${a.middleName}`.toLowerCase();
                        const secondStudentName = `${b.lastName} ${b.firstName} ${b.middleName}`.toLowerCase();
    
                        if (firstStudentName > secondStudentName) {
                            return 1;
                          };
    
                        if (firstStudentName < secondStudentName) {
                            return -1;
                        };
    
                        return 0;
                    });

                    ascFullName = true;

                } else {
                    studentsListArray.sort((a, b) => {
                        const firstStudentName = `${a.lastName} ${a.firstName} ${a.middleName}`.toLowerCase();
                        const secondStudentName = `${b.lastName} ${b.firstName} ${b.middleName}`.toLowerCase();
    
                        if (firstStudentName > secondStudentName) {
                            return 1;
                        };
    
                        if (firstStudentName < secondStudentName) {
                            return -1;
                        };
    
                        return 0;
                    });

                    studentsListArray.reverse();
                    ascFullName = false;
                };

                // Удаление всех строк в таблице
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                };
                
                // Добавление новых строк в таблицу
                createStudentsList(studentsListArray);
            });


            // Сортировка по дате рождения
            let ascBirthday = false;

            sortBirthday.addEventListener('click', () => {
                if (!ascBirthday) {
                    studentsListArray.sort((a, b) => {
                        const firstStudentBirthday = new Date(a.birthday);
                        const secondStudentBirthday = new Date(b.birthday);
    
                        return firstStudentBirthday.getTime() - secondStudentBirthday.getTime();
                    });

                    ascBirthday = true;

                } else {
                    studentsListArray.sort((a, b) => {
                        const firstStudentBirthday = new Date(a.birthday);
                        const secondStudentBirthday = new Date(b.birthday);
    
                        return secondStudentBirthday.getTime() - firstStudentBirthday.getTime();
                    });

                    ascBirthday = false;
                };

                // Удаление всех строк в таблице
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                };
                
                // Добавление новых строк в таблицу
                createStudentsList(studentsListArray);
            });


            // Сортировка по факультету
            let ascFaculty = false;

            sortFaculty.addEventListener('click', () => {

                if (!ascFaculty) {
                    studentsListArray.sort((a, b) => {
                        const firstStudentFaculty = a.faculty.toLowerCase();
                        const secondStudentFaculty = b.faculty.toLowerCase();
    
                        if (firstStudentFaculty > secondStudentFaculty) {
                            return 1;
                        };
    
                        if (firstStudentFaculty < secondStudentFaculty) {
                            return -1;
                        };
    
                        return 0;
                    });

                    ascFaculty = true;

                } else {
                    studentsListArray.sort((a, b) => {
                        const firstStudentFaculty = a.faculty.toLowerCase();
                        const secondStudentFaculty = b.faculty.toLowerCase();
    
                        if (firstStudentFaculty > secondStudentFaculty) {
                            return 1;
                          }
    
                        if (firstStudentFaculty < secondStudentFaculty) {
                            return -1;
                        }
    
                        return 0;
                    });
                    
                    studentsListArray.reverse();
                    ascFaculty = false;
                }

                // Удаление всех строк в таблице
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }
                
                // Добавление новых строк в таблицу
                createStudentsList(studentsListArray);
            });


            // Сортировка по году начала обучения
            let ascStartDate = false;

            sortStartDate.addEventListener('click', () => {
                if (!ascStartDate) {
                    studentsListArray.sort((a, b) => {
                        return Number(a.startDate) - Number(b.startDate);
                    });

                    ascStartDate = true;

                } else {
                    studentsListArray.sort((a, b) => {
                        return Number(b.startDate) - Number(a.startDate);
                    });

                    ascStartDate = false;
                }

                // Удаление всех строк в таблице
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }
                
                // Добавление новых строк в таблицу
                createStudentsList(studentsListArray);
            });


            
// Поиск студентов (фильтр)
            // Работа с контейнером поиска
            const btnSearch = document.querySelector('.btn-search');
            const wrapperSearch = document.querySelector('.wrapper-search');
            const asideSearch = document.querySelector('.aside-search');

            // Кнопка для показа контейнера поиска
            btnSearch.addEventListener('click', () => {
                wrapperSearch.classList.toggle('d-none');
                asideSearch.classList.toggle('border');
                asideSearch.classList.toggle('border-success');
                asideSearch.classList.toggle('rounded');
                asideSearch.classList.toggle('mt-3');

                if (btnSearch.textContent == '') {
                    btnSearch.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="19" fill="currentColor" class="bi bi-search"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg> Поиск';
                    btnSearch.setAttribute('style', 'margin-top: 0px; margin-right: 0px');
                } else {
                    btnSearch.textContent = '';
                    btnSearch.setAttribute('style', 'margin-top: 9px; margin-right: 9px');
                };

                btnSearch.classList.toggle('btn-close');
            });


        // Работа с фильтрами
            const filterName = document.querySelector('.filter-name');
            const filterFaculty = document.querySelector('.filter-faculty');
            const filterStartDate = document.querySelector('.filter-start-date');
            const filterEndDate = document.querySelector('.filter-end-date');


            // Фильтр по Ф/И/О
            filterName.addEventListener('input', () => {
                const filteredArrayName = studentsListArray.filter(student => {
                    return `${student.lastName} ${student.firstName} ${student.middleName}`.toLowerCase().includes(filterName.value.toLowerCase());
                });

                // Удаление всех строк в таблице
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }
                
                // Добавление новых строк в таблицу
                createStudentsList(filteredArrayName);
            });

            
            // Фильтр по факультету
            filterFaculty.addEventListener('input', () => {
                const filteredArrayFaculty = studentsListArray.filter(student => {
                    return student.faculty.toLowerCase().includes(filterFaculty.value.toLowerCase());
                });

                // Удаление всех строк в таблице
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }
                
                // Добавление новых строк в таблицу
                createStudentsList(filteredArrayFaculty);
            });


            // Фильтр по году начала обучения
            filterStartDate.addEventListener('input', () => {
                if (filterStartDate.value !== '') {
                    const filteredArrayStartDate = studentsListArray.filter(student => {
                        return Number(student.startDate) === Number(filterStartDate.value);
                    });
    
                    // Удаление всех строк в таблице
                    while (tableBody.firstChild) {
                        tableBody.removeChild(tableBody.firstChild);
                    }
                    
                    // Добавление новых строк в таблицу
                    createStudentsList(filteredArrayStartDate);

                } else {
                    createStudentsList(studentsListArray);
                };
            });


            // Фильтр по году конца обучения
            filterEndDate.addEventListener('input', () => {
                if (filterEndDate.value !== '') {
                    const filteredArrayEndDate = studentsListArray.filter(student => {
                    return Number(student.startDate) + 4 === Number(filterEndDate.value);
                });

                // Удаление всех строк в таблице
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }

                // Добавление новых строк в таблицу
                createStudentsList(filteredArrayEndDate);

            } else {
                createStudentsList(studentsListArray);
            };
        });    

    });
})();
