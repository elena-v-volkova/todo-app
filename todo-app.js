(function () {

    //создаем и возвращаем заголовок в приложении
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    oldLS = [];
    let toStore = [];

    //создаем и возвращаем форму для создания нового дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название дела';
        button.classList.add('btn', 'btn-primary');
        buttonWrapper.classList.add('input-group-append');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);
        return {
            form,
            input,
            button,
        };
    }

    //создаем и возвращаем cписок элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger')
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);


        return {
            item,
            doneButton,
            deleteButton,
        };
    };

    function createTodoApp(container, title = "Список дел", id = "Мои Дела", toDo) {

        let todoAppTitle = createAppTitle(title)
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        let currentTitle = title;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let button = document.querySelector('button');
        button.setAttribute("disabled", "disabled");

        todoItemForm.input.addEventListener('input', function () {
            if (todoItemForm.input.value !== "") {
                button.removeAttribute("disabled", "disabled");
            } else {
                button.setAttribute("disabled", "disabled");
            }
        });

        //проверка ls на пустоту и добавление дел в основной массив
        if (localStorage.getItem(currentTitle) !== null) {
            oldLS = JSON.parse(localStorage.getItem(currentTitle));
            Array.prototype.push.apply(toStore, oldLS);
        }

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            button.setAttribute("disabled", "disabled");

            let todoItem = createTodoItem(todoItemForm.input.value);

            //добавление дела в массив дел
            toStore.push({ name: todoItemForm.input.value, done: false });

            //добавление обновленного массива дел в localStorage
            localStorage.setItem(currentTitle, JSON.stringify(toStore));

            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                //Изменение статуса дела в массиве дел
                // ищем название дела по которому нажали
                let currentItem = todoItem.item.childNodes[0];
                // ищем по названию индекс в массиве
                let index = toStore.findIndex(el => el.name === currentItem.nodeValue);
                if (toStore[index].done == true) {
                    toStore[index].done = false
                } else {
                    toStore[index].done = true
                }
                localStorage.setItem(currentTitle, JSON.stringify(toStore));

            });


            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove();
                    let currentItem = todoItem.item.childNodes[0];
                    let index = toStore.findIndex(el => el.name === currentItem.nodeValue);
                    toStore.splice(index, 1)
                }
                localStorage.setItem(currentTitle, JSON.stringify(toStore));
            });

            todoList.append(todoItem.item)

            todoItemForm.input.value = '';
        });

        //Добавление из установленного списка
        if (toDo !== undefined && toStore.length < 1) {
            toStore.push.apply(toStore, toDo);
        }

        if (toStore) {
            for (let i = 0; i < toStore.length; i++) {
                let defaultItem = createTodoItem(toStore[i].name);
                if (toStore[i].done == true) {
                    defaultItem.item.classList.add('list-group-item-success');
                }
                todoList.append(defaultItem.item)

                defaultItem.doneButton.addEventListener('click', function () {

                    defaultItem.item.classList.toggle('list-group-item-success');
                    // ищем название дела по которому нажали
                    let currentItem = defaultItem.item.childNodes[0];
                    // ищем по названию индекс в массиве
                    let index = toStore.findIndex(el => el.name === currentItem.nodeValue);
                    if (toStore[index].done == true) {
                        toStore[index].done = false
                    } else {
                        toStore[index].done = true
                    }
                    localStorage.setItem(currentTitle, JSON.stringify(toStore));

                });

                defaultItem.deleteButton.addEventListener('click', function () {
                    if (confirm('Вы уверены?')) {
                        defaultItem.item.remove();
                        let currentItem = defaultItem.item.childNodes[0];
                        let index = toStore.findIndex(el => el.name === currentItem.nodeValue);
                        toStore.splice(index, 1)
                    }
                    localStorage.setItem(currentTitle, JSON.stringify(toStore));
                });
            };
        }


    };
    window.createTodoApp = createTodoApp;
})();


