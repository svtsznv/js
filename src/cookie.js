/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

showCookies();

filterNameInput.addEventListener('keyup', function() {
    showCookies();
});

addButton.addEventListener('click', () => {
    setCookie(addNameInput.value, addValueInput.value);
    showCookies();

    function setCookie(cname, cvalue) {
        // устанавливаем cookie для документа
        document.cookie = cname + '=' + cvalue;
    }
});

function showCookies() {
    // формируем объект, свойства которого - cookies документа на текущий момент
    let cObj = getCookies();

    // формируем таблицу со списком cookies
    createListTable(cObj);
}

function getCookies() {
    return document.cookie
        .split('; ')
        .filter(Boolean)
        .map(cookie => cookie.match(/^([^=]+)=(.+)/))
        .reduce((obj, [, name, value]) => {
            obj[name] = value;
          
            return obj;
        }, {});
}

function createListTable(cObj) {
    // строка для фильтрации cookies
    let flt = filterNameInput.value;

    //  удаляем все дочерние узлы-элементы из таблицы со списком cookies
    delElementNodes(listTable);

    // добавляем строки в таблицу со списком cookies
    for (let prop in cObj) {
        // cookie должна соответствовать фильтру
        if (isMatching(prop, flt) || isMatching(cObj[prop], flt)) {
            addCookieInTable(prop, cObj[prop]);
        }
    }
}

function delElementNodes(parent) {
    let chldrn = parent.children;

    for (let i = chldrn.length - 1; i >= 0; i--) {
        parent.removeChild(chldrn[i]);
    }
}

function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    let pos = full.indexOf(chunk);

    return pos !== -1;
}

function addCookieInTable(cname, cvalue) {
    let tr = document.createElement('tr');

    tr.innerHTML = '<td  class="cookieName">' + cname + '</td>'
        + '<td>' + cvalue + '</td>'
        + '<td><button class="button">Удалить</button></td>';

    listTable.appendChild(tr);

    let btn = tr.getElementsByClassName('button')[0];
   
    btn.addEventListener('click', (event) => {

        event.preventDefault();
       
        let tr = event.target.parentNode.parentNode;
        let td = tr.getElementsByClassName('cookieName')[0];

        delCookie(td.textContent);
        showCookies();
    })
}

function delCookie(cname) {
    let date = new Date(0);

    document.cookie = cname +'=; ' + 'expires=' + date.toUTCString();
}