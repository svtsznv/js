import './styles/styles.scss';
import render from './templates/friends-template.hbs';
import { auth, callAPI } from './js/apiVK';

// главный блок
const mainBlock = document.querySelector('#main-lists');
// основной список друзей
const lstSource = document.querySelector('#source-list');
// список выбранных друзей
const lstTarget = document.querySelector('#target-list');
// поле фильтра для основного списка друзей
const fltSource = document.querySelector('#source-filter');
// поле фильтра для списка выбранных друзей
const fltTarget = document.querySelector('#target-filter');
// кнопка сохранить
const btnSave = document.querySelector('#btn-save');

// массив друзей-объектов (для начала - из локального хранилища)
var arrFriends = getFriendsSL();

showFriends();


// подготовка данных

function getFriendsSL() {
    let json = localStorage.getItem('arrFriends');
    let arrObj = JSON.parse(json || '[]');

    // все объекты из хранилища получают статус видимых
    arrObj.forEach(obj => { obj.visible = true});

    return arrObj;
}

(async () => {
    try {
        await auth();
        const friendsAPI = await callAPI('friends.get', { fields: 'photo_100' });

        arrFriends = mergeFriends(arrFriends, friendsAPI);
        showFriends();

    } catch (e) {
        console.error(e);
    }
})();

function mergeFriends(friendsOld, friendsNew) {
    // массив с вновь полученными данными
    let arrObjNew = [];
    // результирующий массив
    let arrObj = [];

    if (friendsNew) {
        // по вновь полученным данным формируем массив объектов нужной структуры
        friendsNew.forEach(function(friend) {
            let obj = {};
            
            obj.id = friend.id;
            obj.first_name = friend.first_name;
            obj.last_name = friend.last_name;
            obj.photo_100 = friend.photo_100;
            obj.selected = false;
            obj.visible = true;
            arrObjNew.push(obj);
        });
    }

    if (arrObjNew.length == 0) {
        // данные не получены, существующие данные оставляем без изменений
        arrObj = friendsOld.slice();
    } else if (friendsOld.length == 0) {
        // существующих данных не было, все объекты новые
        arrObj = arrObjNew.slice();
    } else {
        // массив вновь полученных данных копируем в результирующий массив 
        arrObj = arrObjNew.slice();
        // из массива существующих данных берем признак выбранного объекта
        arrObj.forEach(obj => {
            obj.selected = friendsOld.some(objOld => {
                return (objOld.id === obj.id && objOld.selected == true);
            });
        });
    }

    return arrObj;
}


// отображение данных

function showFriends() {
    
    // отображаем основной список друзей
    showListFriends(false, lstSource, fltSource);

    // отображаем список выбранных друзей
    showListFriends(true, lstTarget, fltTarget);
}

function showListFriends(isSelected, lstFriends, fltInput) {

    // устанавливаем видимость для списка друзей
    setVisibility(fltInput, isSelected);

    // формируем массив объектов для списка
    const arrObj = arrFriends.filter(obj => {
        return (obj.selected == isSelected && obj.visible == true);
    });
    
    // формируем список
    const html = render({ list: arrObj });

    lstFriends.innerHTML = html;
}


// Drag and Drop

makeDnD([lstSource, lstTarget]);

function makeDnD(zones) {

    zones.forEach(zone => {

        function hndlDragStart(e) {
            // формируем объект с информацией по перетаскиваемому элементу
            const objInf = {zoneID: e.target.parentElement.id, dataID: e.target.getAttribute('data-id')}; 
            
            // сохраняем объект с информацией по перетаскиваемому элементу
            e.dataTransfer.setData('text/plain', JSON.stringify(objInf));
            e.dataTransfer.dropEffect = 'move';
            e.dataTransfer.effectAllowed = 'move';
        }

        function hndlDragOver(e) {
            // для текущей зоны отменяем действия по умолчанию, когда перетаскиваемый объект входит в текущую зону;
            // это дает возможность возникнуть событию drop только для указанных зон
            e.preventDefault();
            return false;
        }

        function hndlDrop(e) {
            // восстанавливаем сохраненный объект с информацией по перетаскиваемому элементу
            const objInf = JSON.parse(e.dataTransfer.getData('text'));

            e.preventDefault();

            // текущая зона не должна совпадать с зоной начала перетаскивания
            if (e.currentTarget.id !== objInf.zoneID) {
                toggleFriendSelected(objInf.dataID);
                showFriends();
            }
        }

        zone.addEventListener('dragstart', hndlDragStart, false);
        zone.addEventListener('dragover', hndlDragOver, false);
        zone.addEventListener('drop', hndlDrop, false);
    })
}


// обработчики событий

mainBlock.addEventListener('click', function(e) {

    if ( e.target.classList.contains('img-add') || e.target.classList.contains('img-remove') ) {
        const li = e.target.parentNode;
        const id = li.getAttribute('data-id');

        toggleFriendSelected(id);
        showFriends();
    }
});

btnSave.addEventListener('click', () => {
    localStorage.removeItem('arrFriends');
    localStorage.setItem('arrFriends', JSON.stringify(arrFriends));
    alert('Списки друзей сохранены.');
});

fltSource.addEventListener('keyup', e => {
    // отображаем основной список друзей
    showListFriends(false, lstSource, fltSource);
});

fltTarget.addEventListener('keyup', e => {
    // отображаем список выбранных друзей
    showListFriends(true, lstTarget, fltTarget);
});


// общие функции

function toggleFriendSelected(id) {
    arrFriends.forEach(friend => {
        if (friend.id == id) {
            friend.selected = !friend.selected;

            return;
        }
    });
}

function setVisibility(fltInput, isSelected) {
    const flt = fltInput.value;

    arrFriends.forEach(friend => {
        if (friend.selected == isSelected) {
            friend.visible = isMatching(friend.first_name, flt) || isMatching(friend.last_name, flt);
        }
    });
}

function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    let pos = full.indexOf(chunk);
        
    return pos !== -1;
}