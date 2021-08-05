const changeTheme = document.querySelector('#themeToggle');
const body = document.querySelector('body');
const newTodo = document.querySelector('.new-todo input');
const todoList = document.querySelector('.todo-list');
// const checkboxes = document.querySelectorAll('input[type=checkbox]');
const itemsLeft = document.querySelector('#itemsLeft');
const clear = document.querySelector('#clear');

//Retrieving saved values when app starts
displayTodos();
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
        const newList = listItems.filter(i => i.state === 'undone');
        
        for(let i=0; i<newList.length; i++) {
            newList[i].num = i+1;
        }
        localStorage.setItem('items', JSON.stringify(newList));
        displayTodos();
    } 
})

//Adding new items
newTodo.addEventListener('change', () => {
    let todoText = newTodo.value;
    saveNewTodo(todoText);
    // displayNewTodo(todoText);
    displayTodos();
    newTodo.value = '';
})

function saveNewTodo(todoText) {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    if(todoText) {
        let newItem = {};

        newItem.num = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')).length+1 : 1;
        newItem.text = todoText;
        newItem.state = 'undone';

        items.push(newItem);

        localStorage.setItem('items', JSON.stringify(items));
    }    
}

// Displaying items
function displayTodos() {
    todoList.innerHTML = "";
    const itemsList = JSON.parse(localStorage.getItem('items')) || [];
    for(let i of itemsList) {
        const newItem = document.createElement('div');
        const div = document.createElement('div');
        const label = document.createElement('label');
        const check = document.createElement('input');
        const span = document.createElement('span');
        const delButton = document.createElement('a');
        const delIcon = document.createElement('img');
    
        delIcon.setAttribute('src', 'images/icon-cross.svg');
        delIcon.setAttribute('alt', 'icon-cross');
    
        delButton.setAttribute('href', '');
        // delButton.classList.add('hide');
        delButton.append(delIcon);
    
        check.setAttribute('type', 'checkbox');
        if(i.state==='done') {
            check.setAttribute('checked', true);
        } else {
            check.removeAttribute('checked');
        }

        span.classList.add('checkmark');
    
        label.append(i.text, check, span);
        label.classList.add(i.state);
        label.classList.add('contain');
    
        div.append(label);
    
        newItem.setAttribute('id', i.num)
        newItem.classList.add('new-item', 'item-box');
        newItem.append(div, delButton);
    
        todoList.append(newItem);        
    }
    updateLeftItems();
}

// function displayNewTodo(todoText) {
//     const newItem = document.createElement('div');
//     const div = document.createElement('div');
//     const label = document.createElement('label');
//     const check = document.createElement('input');
//     const delButton = document.createElement('a');
//     const delIcon = document.createElement('img');

//     delIcon.setAttribute('src', 'images/icon-cross.svg');
//     delIcon.setAttribute('alt', 'icon-cross');

//     delButton.setAttribute('href', '');
//     // delButton.classList.add('hide');
//     delButton.append(delIcon);

//     check.setAttribute('type', 'checkbox');

//     label.append(check, todoText);

//     div.append(label);

//     newItem.classList.add('new-item', 'item-box');
//     newItem.append(div, delButton);

//     todoList.append(newItem);

//     updateLeftItems();
// }

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

    //Delete Item
    if(e.target.nodeName === 'IMG') {
        itemsList.forEach((it, i, arr) => {
            if(it.num == e.target.closest('.new-item').id) {
                arr.splice(i, 1);
            }
        })
        itemsList.forEach((it, i) => {
            it.num = i+1;
        })
        localStorage.setItem('items', JSON.stringify(itemsList));
        
    }

    //Done Item
    if(e.target.nodeName === 'SPAN' || e.target.nodeName === 'LABEL'){
        let checkbox = e.target.closest('.new-item').firstChild.firstChild.firstElementChild;
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

    // if(e.target.type === 'checkbox') {
    //     console.log(e.target);
    //     if(e.target.checked) {
    //         for(let i of itemsList) {
    //             if(i.num == e.target.closest('.new-item').id) {
    //                 i.state = 'done';
    //                 break;
    //             }
    //         }
    //         e.target.parentNode.setAttribute('class', 'done');
    //     } else {
    //         for(let i of itemsList) {
    //             if(i.num == e.target.closest('.new-item').id) {
    //                 i.state = 'undone';
    //                 break;
    //             }
    //         }
    //         e.target.parentNode.setAttribute('class', 'undone');
    //     }
    //     localStorage.setItem('items', JSON.stringify(itemsList))
    // }
    displayTodos();
})


        
