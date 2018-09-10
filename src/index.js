import './styles/styles.scss';
import renderPopup from './templates/georemark-content.hbs';


// блок с картой
const mapBlock = document.querySelector('#YMapsID');
// блок с всплывающим окном
const popupBlock = document.querySelector('#popUp');

// функция, форматирующая дату
var dtFormatter = new Intl.DateTimeFormat("ru", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });

var myMap;
var myClusterer;
var arrPlaceMarks = [];

// массив отзывов-объектов (для начала - из локального хранилища)
var arrRemarks = getRemarksSL();


ymaps.ready(async () => {

    // карта
    myMap = new ymaps.Map('YMapsID', {
        center: [55.76, 37.64], // Москва
        zoom: 10
    }, { searchControlProvider: 'yandex#search' });

    // кластеризатор геообъектов с макетом-каруселью
    myClusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        // запрещаем приближать карту при клике на кластеры
        clusterDisableClickZoom: true,
        // макет-карусель
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // скрывать метку при открытии балуна
        hideIconOnBalloonOpen: false,
        // запрещаем зацикливание списка при постраничной навигации
        clusterBalloonCycling: false,
        // настройка внешнего вида панели навигации: элементами панели навигации будут цифры
        clusterBalloonPagerType: 'numeric',
        // количество элементов в панели навигации
        clusterBalloonPagerSize: 7,
        // разрешаем открытие балуна при клике на кластере
        openBalloonOnClick: true
    });

    myMap.geoObjects.add(myClusterer);
    
    // формируем метки по данным массива отзывов
    setPlacemarksFromLS();

    // добавляем обработчик события - щелчок мышью по карте
    myMap.events.add('click', function (e) {
        // получаем гео координаты
        let geoCoords = e.get('coords');
        // получаем координаты курсора
        let arrPos = e.get('position');

        // открываем всплывающее окно
        openPopup(geoCoords, arrPos, true);
    });
});


// Начальные действия

// Формирование массива отзывов-объектов из локального хранилища
function getRemarksSL() {
    let json = localStorage.getItem('arrRemarks');
    let arrObj = JSON.parse(json || '[]');

    return arrObj;
}

// Формирование меток по данным массива отзывов
function setPlacemarksFromLS() {

    if (arrRemarks.length > 0) {
        // цикл по массиву отзывов
        arrRemarks.forEach(obj => {
            // создаем метку
            let placemark = createPlacemark(obj);
            // добавляем метку в массив гео объектов
            arrPlaceMarks.push(placemark);
        });

        // добавляем метки в кластер
        myClusterer.add(arrPlaceMarks);
        myMap.setBounds(myClusterer.getBounds(), {
            checkZoomRange: true
        });
    }
}

// Создание метки
function createPlacemark(objRemark) {
    // массив гео координат
    let geoCoords = JSON.parse(objRemark.geo_coords);

    // создаем метку
    let placemark = new ymaps.Placemark(geoCoords, {
        balloonContentHeader: objRemark.remark_place,
        balloonContentBody: [
            '<a href="#" geo-coords="' + objRemark.geo_coords + '" class="balloon__body" id="geo-address">',
            objRemark.geo_address,
            '</a> <br><br>',
            objRemark.remark_text
        ].join(''),
        //balloonContentFooter: '<span style="text-align:right; vertical-align: bottom">' + objRemark.date_time + '</span>',
        balloonContentFooter: '<p style="text-align:right">' + objRemark.date_time + '</p>',
        balloonContentCoords: geoCoords
    },
        {
            preset: 'islands#violetIcon',
            // балун отображается в качестве всплывающего окна над меткой
            balloonPanelMaxMapArea: 0,
            // включаем кнопку закрытия балуна (если/когда балун будет показываться)
            balloonCloseButton: true,
            // запрещаем открытие балуна при клике на одиночную метку
            openBalloonOnClick: false,
            // включаем кнопку закрытия балуна для кластера
            clustererBalloonCloseButton: true,
            // скрывать метку при открытии балуна
            hideIconOnBalloonOpen: false
        }
    );

    // добавляем обработчик события для метки
    placemark.events.add('click', function (e) {
        // получаем гео координаты метки
        let geoCoords = e.originalEvent.target.geometry.getCoordinates();
        // получаем координаты курсора
        let arrPos = e.get('position');

        // открываем всплывающее окно
        openPopup(geoCoords, arrPos, false);
    });

    return placemark;
}


// Обработчики событий

// Добавление обработчика события - щелчка мышью для блока с картой
mapBlock.addEventListener('click', e => {

    if ( e.target.id == 'geo-address' ) {
        // возникло событие - клик мышью на адресе-ссылке

        // формируем массив гео координат для текущего адреса
        const ref = e.target;
        const geoCoords = JSON.parse(ref.getAttribute('geo-coords'));

        // закрываем окно родителя-балуна
        myMap.balloon.close();

        // получаем координаты курсора
        const arrPos = [e.clientX, e.clientY];

        // открываем всплывающее окно
        openPopup(geoCoords, arrPos, false);
    }

});

// Добавление обработчика события - щелчка мышью во всплывающем окне
popupBlock.addEventListener('click', e => {

    if ( e.target.classList.contains('header-close') ) {
        popupBlock.innerHTML = '';
    } else if ( e.target.classList.contains('btn-add') ) {
        // элементы всплывающего окна
        const divAddress = document.getElementById('geo-address');
        const divNick = document.getElementById('remark-nickname');
        const divPlace = document.getElementById('remark-place');
        const divText = document.getElementById('remark-text');

        // добавляем объект с данными отзыва в массив отзывов
        let obj = {};
            
        obj.date_time = dtFormatter.format(new Date());
        obj.geo_coords = divAddress.getAttribute('geo-coords');
        obj.geo_address = divAddress.innerText;
        obj.nick_name = divNick.value;
        obj.remark_place = divPlace.value;
        obj.remark_text = divText.value;
        arrRemarks.push(obj);

        // сохраняем массив отзывов в локальное хранилище
        localStorage.removeItem('arrRemarks');
        localStorage.setItem('arrRemarks', JSON.stringify(arrRemarks));

        // создаем метку, а затем добавляем ее в массив и в кластеризатор
        let placemark = createPlacemark(obj);
        arrPlaceMarks.push(placemark);
        myClusterer.add(placemark);
        
        // дополняем список отзывов
        setRemarksList([obj]);

        // очищаем поля ввода
        divNick.value = '';
        divPlace.value = '';
        divText.value = '';
    }

});


// Общие функции

// Открытие всплывающего окна
function openPopup(geoCoords, arrPos, isNew) {
    const [posX, posY] = arrPos;
    const htmlPopup = renderPopup();

    popupBlock.innerHTML = htmlPopup;

    // устанавливаем положение всплывающего окна
    const popupCoords = calcPopupCoords(posX, posY, popupBlock, mapBlock);

    popupBlock.style.top = popupCoords.top + 'px';
    popupBlock.style.left = popupCoords.left + 'px';

    // элемент - заголовок всплывающего окна
    const divAddress = document.getElementById('geo-address');

    // сохраняем гео координаты в атрибут элемента - заголовка всплывающего окна
    const strGeoCoords = JSON.stringify(geoCoords);
    divAddress.setAttribute('geo-coords', strGeoCoords);

    if (isNew) {
        // метка новая
        // получаем адрес и вставляем его в заголовок всплывающего окна
        ymaps.ready( () => {
            let geoAddress = getAddress(geoCoords);

            geoAddress.then(res => {
                const address = res;
                divAddress.innerText = address;
            });
        });
    } else {
        // метка уже была добавлена ранее
        // формируем массив отзывов по координатам метки
        const arrObj = arrRemarks.filter(obj => {
            return (obj.geo_coords == strGeoCoords);
        });

        // вставляем адрес в заголовок
        if (arrObj.length > 0) {
            divAddress.innerText = arrObj[0].geo_address;
        }

        // формируем список отзывов
        setRemarksList(arrObj);
    }
}

// Определение адреса клика на карте с помощью обратного геокодирования
function getAddress(geoCoords) {

    return ymaps.geocode(geoCoords, { kind: 'house' })
        .then(res => {
            let firstGeoObject = res.geoObjects.get(0);

            return firstGeoObject.getAddressLine();
        })
}

// Определение координат всплывающего окна
function calcPopupCoords(clientX, clientY, innerEl, outerEl) {
    const offset = 5;
    let objCoords = {top: 0, left: 0};

    objCoords.left = (clientX + offset < outerEl.clientWidth - innerEl.clientWidth) ? clientX + offset: clientX - innerEl.clientWidth - offset;
    objCoords.left = (objCoords.left < 0) ? 0: objCoords.left;
    
    objCoords.top = (clientY + offset < outerEl.clientHeight - innerEl.clientHeight) ? clientY + offset: clientY - innerEl.clientHeight - offset;
    objCoords.top = (objCoords.top < 0) ? 0: objCoords.top;

    return objCoords;
}

// Заполнение списка отзывов во всплывающем окне
function setRemarksList(arrObj) {
    // элемент - список отзывов всплывающего окна
    const divList = document.getElementById('remarks-list');

    arrObj.forEach(obj => {
        divList.innerHTML = divList.innerHTML + '<b>' + obj.nick_name + '</b>';
        divList.innerHTML = divList.innerHTML + ` ${obj.remark_place} ${obj.date_time}<br>${obj.remark_text}<br><br>`;
    });
}
