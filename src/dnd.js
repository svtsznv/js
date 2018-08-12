/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
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

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
    // задаем коэффициент (в процентах), от которого зависит положение и размеры создаваемого элемента
    const coeff = 50;
    
    function getRandomColor24bit() {
        // 16777216 - максимальное количество цветов при глубине цвета 24 бит/пиксель
        // метод toString(16) преобразует число в строку - шестнадцатиричное число
        var color = Math.floor(Math.random() * 16777216).toString(16);
    
        // к шестнадцатиричному числу добавляем слева подстроку нужной длины
        return '#000000'.slice(0, -color.length) + color;
    }
    
    function getRandomNumberPct() {
        let randomNumber = Math.round(Math.random() * coeff);

        return randomNumber.toString() + '%';
    }

    let newDiv = document.createElement('DIV');
    
    newDiv.setAttribute('class', 'draggable-div');
    newDiv.style.background = getRandomColor24bit();
    newDiv.style.display = 'inline-block';
    newDiv.style.position = 'absolute';
    newDiv.style.top = getRandomNumberPct();
    newDiv.style.left = getRandomNumberPct();
    newDiv.style.width = getRandomNumberPct();
    newDiv.style.height = getRandomNumberPct();
    
    return newDiv;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
    // объявляем переменные, фиксирующие новую позицию мыши
    var pos1 = 0; 
    var pos2 = 0;
    // объявляем переменные, фиксирующие прежнюю позицию мыши
    var pos3 = 0;
    var pos4 = 0;

    target.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(event) {
        // для элемента запрещаем действия по умолчанию
        event.preventDefault();
        // фиксируем стартовую позицию курсора мыши
        pos3 = event.clientX;
        pos4 = event.clientY;
        // прекращаем обработку событий мыши
        document.onmouseup = closeDragElement;
        // обрабатываем перемещение курсора мыши
        document.onmousemove = elementDrag;
    }

    function elementDrag(event) {
        // для элемента запрещаем действия по умолчанию
        event.preventDefault();
        // рассчитываем новые координаты курсора мыши
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        // сохраняем координаты курсора мыши в момент клика
        pos3 = event.clientX;
        pos4 = event.clientY;
        // устанавливаем новое положение элемента
        target.style.left = (target.offsetLeft - pos1) + 'px';
        target.style.top = (target.offsetTop - pos2) + 'px';
    }

    function closeDragElement() {
        // прекращаем обработку событий мыши
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};