let form = document.querySelector('.form')
let grocery = document.getElementById('grocery')
let groceryList = document.querySelector('.grocery-list')
let alert = document.querySelector('.alert')
let groceryContainer = document.querySelector('.grocery-container')
let clearItemsBtn = document.querySelector('.clear-btn')
let submitBtn = document.querySelector('.submit-btn')

//edit option
let editElement
let editFlag = false
let editID = ''
//edit option

window.addEventListener('DOMContentLoaded', setupItems)

form.addEventListener('submit', addItem)
clearItemsBtn.addEventListener('click', clearItems)

function addItem(e) {
  e.preventDefault()
  console.log('add item')

  let value = grocery.value
  let id = new Date().getTime().toString()

  if (value && editFlag === false) {
    createItemsList(id, value)

    groceryContainer.classList.add('show-container')

    addToLocalStorage(id, value)

    setBackToDefult()
  } else if (value && editFlag === true) {
    editElement.innerHTML = value
    setBackToDefult()
  }
}

function clearItems() {
  let items = document.querySelectorAll('.grocery-item')

  if (items.length > 0) {
    items.forEach(function (item) {
      groceryList.removeChild(item)
    })
  }
  groceryContainer.classList.remove('show-container')

  setBackToDefult()

  localStorage.removeItem('list')
}

function deleteItem(e) {
  let element = e.currentTarget.parentElement.parentElement
  let id = element.dataset.id

  groceryList.removeChild(element)

  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove('show-container')
  }

  removeFromLocalStorage(id)

  setBackToDefult()
}

function editItem(e) {
  let element = e.currentTarget.parentElement.parentElement
  editElement = e.currentTarget.parentElement.previousElementSibling

  grocery.value = editElement.innerHTML
  submitBtn.value = 'Edit'
  editFlag = true
  editID = element.dataset.id
}

function setBackToDefult() {
  grocery.value = ''
  editFlag = false
  submitBtn.value = 'Submit'
  editID = ''
}

function addToLocalStorage(id, value) {
  let grocery = { id: id, value: value }

  let items = getLocalStorage()

  items.push(grocery)

  localStorage.setItem('list', JSON.stringify(items))
}

function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : []
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage()

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item
    }
  })

  localStorage.setItem('list', JSON.stringify(items))
}

function setupItems() {
  let items = getLocalStorage()

  if (items.length > 0) {
    items.forEach(function (item) {
      createItemsList(item.id, item.value)
    })
    groceryContainer.classList.add('show-container')
  }
}

function createItemsList(id, value) {
  let element = document.createElement('article')
  element.classList.add('grocery-item')

  let attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)

  let elementContent = `<p>${value}</p>
                
    <div class="buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>`

  element.innerHTML = elementContent

  const deleteBtn = element.querySelector('.delete-btn')
  deleteBtn.addEventListener('click', deleteItem)
  const editBtn = element.querySelector('.edit-btn')
  editBtn.addEventListener('click', editItem)

  groceryList.appendChild(element)
}
