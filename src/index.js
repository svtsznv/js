/* ДЗ 4 - работа с DOM */

/*
 Задание 1:

 1.1: Функция должна создать элемент с тегом DIV

 1.2: В созданный элемент необходимо поместить текст, переданный в параметр text

 Пример:
   createDivWithText('loftschool') // создаст элемент div, поместит в него 'loftschool' и вернет созданный элемент
 */
function createDivWithText(text) {
    var div = document.createElement('div');

    div.textContent = text;
    
    return div;
}

/*
 Задание 2:

 Функция должна вставлять элемент, переданный в переметре what в начало элемента, переданного в параметре where

 Пример:
   prepend(document.querySelector('#one'), document.querySelector('#two')) 
   // добавит элемент переданный первым аргументом в начало элемента переданного вторым аргументом
 */
function prepend(what, where) {
    where.insertBefore(what, where.firstChild);
}

/*
 Задание 3:

 3.1: Функция должна перебрать все дочерние элементы узла, переданного в параметре where

 3.2: Функция должна вернуть массив, состоящий из тех дочерних элементов следующим 
 соседом которых является элемент с тегом P

 Пример:
   Представим, что есть разметка:
   <body>
      <div></div>
      <p></p>
      <a></a>
      <span></span>
      <p></p>
   </dody>

   findAllPSiblings(document.body) 
   // функция должна вернуть массив с элементами div и span т.к. 
   следующим соседом этих элементов является элемент с тегом P
 */
function findAllPSiblings(where) {
    var arr = [];
 
    for (const el of where.children) {
        if (el.nextElementSibling !== null && el.nextElementSibling.tagName == 'P') {
            arr.push(el);
        }
    }
    
    return arr;
}

/*
 Задание 4:

 Функция представленная ниже, перебирает все дочерние узлы типа "элемент" внутри узла 
 переданного в параметре where и возвращает массив из текстового содержимого найденных элементов
 Но похоже, что в код функции закралась ошибка и она работает не так, как описано.

 Необходимо найти и исправить ошибку в коде так, чтобы функция работала так, как описано выше.

 Пример:
   Представим, что есть разметка:
   <body>
      <div>привет</div>
      <div>loftschool</div>
   </dody>

   findError(document.body) // функция должна вернуть массив с элементами 'привет' и 'loftschool'
 */
function findError(where) {
    var result = [];

    for (var child of where.children) {
        result.push(child.innerText);
    }

    return result;
}

/*
 Задание 5:

 Функция должна перебрать все дочерние узлы элемента переданного в параметре where и удалить из него все текстовые узлы

 Задачу необходимо решить без использования рекурсии, то есть можно не уходить вглубь дерева.
 Так же будьте внимательны при удалении узлов, т.к. можно получить неожиданное поведение при переборе узлов

 Пример:
   После выполнения функции, дерево <div></div>привет<p></p>loftchool!!!
   должно быть преобразовано в <div></div><p></p>
 */
function deleteTextNodes(where) {
    var chldrn = where.childNodes;
    
    for (let i = chldrn.length - 1; i >= 0; i--) {
        if (chldrn[i].nodeType === 3) {
            where.removeChild(chldrn[i]);
        }
    }
}

/*
 Задание 6:

 Выполнить предудыщее задание с использование рекурсии - то есть необходимо заходить внутрь 
 каждого дочернего элемента (углубляться в дерево)

 Задачу необходимо решить без использования рекурсии, то есть можно не уходить вглубь дерева.
 Так же будьте внимательны при удалении узлов, т.к. можно получить неожиданное поведение при переборе узлов

 Пример:
   После выполнения функции, дерево <span> <div> <b>привет</b> </div> <p>loftchool</p> !!!</span>
   должно быть преобразовано в <span><div><b></b></div><p></p></span>
 */
function deleteTextNodesRecursive(where) {
    var chldrn = where.childNodes;
    
    for (let i = chldrn.length - 1; i >= 0; i--) {
        if (chldrn[i].nodeType === 3) {
            where.removeChild(chldrn[i]);
        } else {
            deleteTextNodesRecursive(chldrn[i]);
        }
    }
}

/*
 Задание 7 *:

 Необходимо собрать статистику по всем узлам внутри элемента переданного в параметре root и вернуть ее в виде объекта
 Статистика должна содержать:
 - количество текстовых узлов
 - количество элементов каждого класса
 - количество элементов каждого тега
 Для работы с классами рекомендуется использовать classList
 Постарайтесь не создавать глобальных переменных

 Пример:
   Для дерева <div class="some-class-1"><b>привет!</b> <b class="some-class-1 some-class-2">loftschool</b></div>
   должен быть возвращен такой объект:
   {
     tags: { DIV: 1, B: 2},
     classes: { "some-class-1": 2, "some-class-2": 1 },
     texts: 3
   }
 */
function collectDOMStat(root) {
    // создаем объект для сбора статистики
    var resObj = {
        // свойство содержит объект, у которого свойства - теги, значения свойств - количество элементов каждого тега
        tags: {},
        // свойство содержит объект, у которого свойства - классы, значения свойств - количество элементов каждого класса
        classes: {},
        // значение свойства - количество текстовых узлов
        // присваиваем начальное значение, равное 0
        texts: 0
    };
      
    // код оформляем в виде отдельной функции, так как потребуется рекурсия для обхода дерева
    // результирующий объект для сбора статистики передаем в функцию в виде аргумента для выполнения условия:
    // "Постарайтесь не создавать глобальных переменных"
    function collectDOMStatNodes(node, resObj) {

        // в цикле перебираем узлы из коллекции: и типа текст, и типа элемент
        for (const chld of node.childNodes) {
            if (chld.nodeType === 3 ) {
                // значение типа узла, равное 3, означает, что текущий узел - текстовый
                // увеличиваем текущее количество текстовых узлов на 1
                resObj.texts += 1;
            } else {
                // текущий узел chld - не текстовый
                // узел может относиться к нескольким классам
                // в цикле перебираем классы текущего узла
                for (const cls of chld.classList) {
                    // если текущий класс уже имеется в объекте для сбора статистики,
                    // то в объекте classes значение свойства-текущего класса увеличивается на 1;
                    // если текущий класс еще не имеется в объекте для сбора статистики,
                    // то в этой строке создается новое свойство cls объекта classes
                    // этому свойству тернарным оператором присваивается значение 0,
                    // которое сразу увеличивается на 1
                    resObj.classes[cls] = (resObj.classes[cls] ? resObj.classes[cls] : 0) + 1;
                }
    
                // создаем строковую переменную с именем тега текущего узла chld
                var tagName = chld.tagName;
    
                // если этот тег уже имеется в объекте для сбора статистики,
                // то в объекте tags значение свойства-этого тега увеличивается на 1;
                // если этот тег еще не имеется в объекте для сбора статистики,
                // то в этой строке создается новое свойство tagName объекта tags
                // этому свойству тернарным оператором присваивается значение 0,
                // которое сразу увеличивается на 1
                resObj.tags[tagName] = (resObj.tags[tagName] ? resObj.tags[tagName] : 0) + 1;
    
                // рекурсивно вызываем процедуру, чтобы собрать статистику по дочерним узлам текущего узла chld
                resObj = collectDOMStatNodes(chld, resObj);
            }
        }

        // функция возвращает объект для сбора статистики
        return resObj;
    }
    
    // функция возвращает объект для сбора статистики по всем дочерним узлам дерева root
    return collectDOMStatNodes(root, resObj);
}

/*
 Задание 8 *:

 8.1: Функция должна отслеживать добавление и удаление элементов внутри элемента переданного в параметре where
 Как только в where добавляются или удаляются элементы,
 необходимо сообщать об этом при помощи вызова функции переданной в параметре fn

 8.2: При вызове fn необходимо передавать ей в качестве аргумента объект с двумя свойствами:
   - type: типа события (insert или remove)
   - nodes: массив из удаленных или добавленных элементов (в зависимости от события)

 8.3: Отслеживание должно работать вне зависимости от глубины создаваемых/удаляемых элементов

 Рекомендуется использовать MutationObserver

 Пример:
   Если в where или в одного из его детей добавляется элемент div
   то fn должна быть вызвана с аргументом:
   {
     type: 'insert',
     nodes: [div]
   }

   ------

   Если из where или из одного из его детей удаляется элемент div
   то fn должна быть вызвана с аргументом:
   {
     type: 'remove',
     nodes: [div]
   }
 */
function observeChildNodes(where, fn) {
    var onMutate = function(mutationsList) {
        mutationsList.forEach(mutation => {
            var addedNodes = mutation.addedNodes;
            var removedNodes = mutation.removedNodes;
    
            if (addedNodes.length > 0) {
                fn({
                    type: 'insert',
                    nodes: [...addedNodes]
                });
            }
    
            if (removedNodes.length > 0) {
                fn({
                    type: 'remove',
                    nodes: [...removedNodes]
                });
            }
        });
    };
    
    var observer = new MutationObserver(onMutate);
    const mutationConfig = {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false,
        characterDataOldValue: false
    };
    
    observer.observe(where, mutationConfig);
}

export {
    createDivWithText,
    prepend,
    findAllPSiblings,
    findError,
    deleteTextNodes,
    deleteTextNodesRecursive,
    collectDOMStat,
    observeChildNodes
};