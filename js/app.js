const changeTheme = document.querySelector('#themeToggle');
const body = document.querySelector('body');
const newTodo = document.querySelector('.new-todo input');
const todoList = document.querySelector('.todo-list');
const itemsLeft = document.querySelector('#itemsLeft');
const clear = document.querySelector('#clear');
var all = document.querySelector('#all');
const active = document.querySelector('#active');
const completed = document.querySelector('#completed');

//Retrieving saved values when app starts
displayTodos(localStorage.getItem('filter'));
if(localStorage.getItem('theme') && localStorage.getItem('icon')){
    body.classList.remove('lightTheme');
    body.classList.add(localStorage.getItem('theme'));
    changeTheme.lastChild.setAttribute('src', localStorage.getItem('icon'));
} 

// Toggling between themes
changeTheme.addEventListener('click', (e) => {
    e.preventDefault();
    body.classList.toggle('darkTheme');
    body.classList.toggle('lightTheme');

    if(body.classList.contains('darkTheme')) {
        localStorage.setItem('icon', 'images/icon-sun.svg');
        localStorage.setItem('theme', 'darkTheme');
    } else {
        localStorage.setItem('icon', 'images/icon-moon.svg');
        localStorage.setItem('theme', 'lightTheme');
    }     
    
    changeTheme.lastChild.setAttribute('src', localStorage.getItem('icon'));   
})

//Clearing completed
clear.addEventListener('click', (e) => {
    e.preventDefault();

    if(localStorage.getItem('items')) {
        const listItems = JSON.parse(localStorage.getItem('items'));
        const ord = localStorage.getItem('order').split(',');
        const newOrd = [];
        const ordered = orderItems(listItems, ord);

        const newList = ordered.filter(i => i.state === 'undone');
        
        for(let i=0; i<newList.length; i++) {
            newList[i].num = i+1;
            newOrd[i] = i+1;
        }

        localStorage.setItem('items', JSON.stringify(newList));
        localStorage.setItem('order', newOrd.join(','));
        displayTodos(localStorage.getItem('filter'));
    } 
})

//Adding new items
newTodo.addEventListener('change', () => {
    let todoText = newTodo.value;
    saveNewTodo(todoText);
    displayTodos(localStorage.getItem('filter'));
    newTodo.value = '';
})

function saveNewTodo(todoText) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    if(todoText) {
        const newItem = {};
        const ord = localStorage.getItem('order') ? localStorage.getItem('order').split(',') : [];
        
        newItem.num = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')).length+1 : 1;
        ord.push(newItem.num);
        newItem.text = todoText;
        newItem.state = 'undone';
        items.push(newItem);

        localStorage.setItem('items', JSON.stringify(items));
        localStorage.setItem('order', ord.join(','));
    }    
}

// Displaying items by filter
function displayTodos(filter='all') {
    todoList.innerHTML = "";
    let itemsList = JSON.parse(localStorage.getItem('items')) || [];

    const ord = localStorage.getItem('order') ? localStorage.getItem('order').split(','): "";

    itemsList = orderItems(itemsList, ord);
    console.log(itemsList);
    
    if(filter === 'active') {
        active.classList.add('active');
        all.classList.remove('active');
        completed.classList.remove('active');
    } else if (filter === 'completed') {
        completed.classList.add('active');
        active.classList.remove('active');
        all.classList.remove('active');
    } else {
        all.classList.add('active');
        active.classList.remove('active');
        completed.classList.remove('active');
    }

    itemsList = itemsList.filter(item => {
        if(filter === 'active') {
            return item.state === 'undone';
        } else if (filter === 'completed') {
            return item.state === 'done';
        } else {
            return item;
        }
    })

    for(let i of itemsList) {
        const newItem = document.createElement('div');
        const div = document.createElement('div');
        const label = document.createElement('label');
        const check = document.createElement('input');
        const span = document.createElement('span');
        const move = document.createElement('strong');
        const moveImg = document.createElement('img');
        const delButton = document.createElement('a');
        const delIcon = document.createElement('img');
    
        delIcon.setAttribute('src', 'images/icon-cross.svg');
        delIcon.setAttribute('alt', 'delete item');
    
        delButton.setAttribute('href', '');
        delButton.append(delIcon);
    
        check.setAttribute('type', 'checkbox');
        if(i.state==='done') {
            check.setAttribute('checked', true);
        } else {
            check.removeAttribute('checked');
        }

        span.classList.add('checkmark');

        moveImg.setAttribute('src', 'images/vertical.png');
        moveImg.setAttribute('alt', 'move item');

        move.append(moveImg);
        move.classList.add('handle');
    
        label.append(i.text, check, span);
        label.classList.add(i.state);
        label.classList.add('contain');
    
        div.append(label);
    
        newItem.setAttribute('id', i.num)
        newItem.setAttribute('data-id', i.num)
        newItem.classList.add('new-item', 'item-box');
        newItem.append(div, delButton, move);
    
        todoList.append(newItem);        
    }
    updateLeftItems();
}

//updating left items
function updateLeftItems() {
    if(localStorage.getItem('items')) {
        const listItems = JSON.parse(localStorage.getItem('items'));
        let count = 0;
        for(let item of listItems) {
            if (item.state === 'undone')
                count++;
        }
        itemsLeft.textContent = `${count} items left`;
    } else
        itemsLeft.textContent = '0 items left';
}

// Items Events
todoList.addEventListener('click', (e) => {
    e.preventDefault();
    const itemsList = JSON.parse(localStorage.getItem('items')) || [];
    let ord = localStorage.getItem('order').split(',');
    let deleted = 0;

    //Delete Item
    if(e.target.nodeName === 'IMG') {
        itemsList.forEach((it, i, arr) => {
            if(it.num == e.target.closest('.new-item').id) {
                deleted = arr.splice(i, 1);
            }
        })     
        console.log('del', deleted);
        ord.forEach((num, i) => {
            if(num == deleted[0].num)
                ord.splice(i, 1);
            console.log(ord);
        })

        itemsList.forEach((it) => {
            if(it.num > deleted[0].num)
                it.num--;
        })

        ord.forEach((num, i) => {
            if(Number(num) > deleted[0].num)
                ord[i] = Number(num)-1;
        })
        
        localStorage.setItem('items', JSON.stringify(itemsList));
        localStorage.setItem('order', ord.join(','));
    }

    //Done Item
    if(e.target.nodeName === 'SPAN' || e.target.nodeName === 'LABEL'){
        let checkbox = e.target.closest('.new-item label').firstElementChild;
        if(checkbox.checked){
            checkbox.removeAttribute('checked');
        }
        else{
            checkbox.setAttribute('checked', true);
        }

        if(checkbox.checked) {
            for(let i of itemsList) {
                if(i.num == e.target.closest('.new-item').id) {
                    i.state = 'done';
                    break;
                }
            }
            e.target.parentNode.setAttribute('class', 'done');
        } else {
            for(let i of itemsList) {
                if(i.num == e.target.closest('.new-item').id) {
                    i.state = 'undone';
                    break;
                }
            }
            e.target.parentNode.setAttribute('class', 'undone');
        }
        localStorage.setItem('items', JSON.stringify(itemsList))
    }
    displayTodos(localStorage.getItem('filter'));
})

// Filters

// All
all.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('filter', 'all');
    displayTodos(localStorage.getItem('filter'));
})

//Active
active.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('filter', 'active');
    displayTodos(localStorage.getItem('filter'));
})

//Completed
completed.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('filter', 'completed');
    displayTodos(localStorage.getItem('filter'));
})

//Drag and Drop reordering list

Sortable.create(todoList, {
    handle: '.handle',
    animation: 150,
    chosenClass: 'selected',
    dragClass: 'dragging',
    group: "todo-list",
    store: {
        set: (sortable) => {
            const order = sortable.toArray();
            localStorage.setItem('order', order.join(','))
        },

        get: (sortable) => {
            const order = localStorage.getItem('order');
            return order ? order.split(',') : []; 
        }
    }
});

function orderItems(list, ord) {
    let ordered = [];
    if(ord.length > 0) {
        for(let item of list) {
            ord.forEach((num, i) => {
                if(item.num === Number(num)) {
                    ordered[i] = item;
                }
            })
        }
    } else {
        ordered = [...list];
    }
    
    return ordered;
} 