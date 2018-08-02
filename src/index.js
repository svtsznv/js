/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    var arrR = [];

    for (let i = 0; i < array.length; i++) {
        arrR.push(fn(array[i], i, array));
    }

    return arrR;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    var res;
    var idxBegin;

    if (initial === undefined) {
        res = array[0];
        idxBegin = 1;
    } else {
        res = initial;
        idxBegin = 0;
    }
    for (let i = idxBegin; i < array.length; i++) {
        res = fn(res, array[i]);
    }

    return res;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    var arrProps = [];
  
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) !== undefined) {
            arrProps.push(prop.toUpperCase());
        }
    }
  
    return arrProps;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from, to) {
    var arrRes = [];
    var idxBegin = (from === undefined) ? 0 : from;
    var idxEnd = (to === undefined) ? array.length : to;

    idxBegin = (idxBegin < 0) ? array.length + idxBegin : idxBegin;
    idxEnd = (idxEnd < 0) ? array.length + idxEnd : idxEnd;
  
    for (let i = idxBegin; i < idxEnd; i++) {
        arrRes.push(array[i]);
    }

    return arrRes;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    var hndlr = {
        set: function(obj, prop, value) {
            obj[prop] = (isFinite(value)) ? value * value : value;
        }
    };
      
    return new Proxy(obj, hndlr);
}

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};