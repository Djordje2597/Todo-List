/*DATE*/

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const currentDate = document.getElementById("date-container");
const date = new Date();
const day = date.getDay();
const month = date.getMonth();
const year = date.getFullYear();
currentDate.innerHTML = `<h1>${days[day]}, ${
  months[month]
} ${date.getDate()}, ${year}</h1>`;

/**Selecting elements */
const form = document.getElementById("todo-form");
const item = document.getElementById("new-input");
const submitBtn = document.getElementById("submit-btn");
const container = document.querySelector(".list-container");
const list = document.querySelector(".list");
const clearBtn = document.querySelector(".clearAll");
const alertMsg = document.querySelector(".alert-message");
const inputField = document.getElementById("active-item");
let editElement;
let editFlag = false;
let editID = "";

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

/**FUNCTIONS */

function addItem(e) {
  e.preventDefault();
  const value = item.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id, value);
    // show list
    list.classList.add("show-list");
    // local storage
    addToLocalStorage(id, value);
    // sbt default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;

    setBackToDefault();
  } else {
    alert("Please enter the value!");
  }
}

function clearItems() {
  const items = document.querySelectorAll(".input-items");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  } else if (items.length === 0) {
    alertMsg.classList.add("show-message");
    setTimeout(function () {
      alertMsg.classList.remove("show-message");
    }, 2000);
  }
  setBackToDefault();
  localStorage.removeItem("list");
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  setBackToDefault();
  removeFromLocalStorage(id);
}

function editItem(e) {
  const element =
    e.currentTarget.parentElement.previousElementSibling.children[1];
  //edit value
  editElement =
    e.currentTarget.parentElement.previousElementSibling.children[1];
  //set form value
  item.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.value = "Edit";
}

/**LOCAL STORAGE & BACK TO DEFAULT */

function setBackToDefault() {
  item.value = "";
  editFlag = false;
  editID = "";
  submitBtn.value = "Submit";
}
function addToLocalStorage(id, value) {
  const item = { id: id, value: value };
  let items = getLocalStorage();
  items.push(item);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

/**SETUP */
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    list.classList.add("show-list");
  }
}

function createListItem(id, value) {
  const element = document.createElement("div");
  element.classList.add("input-items");
  // add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<div class="input-item">
            <div class="label-div">
              <input type="checkbox" class="text" id="active-item" onclick="checkInputField()"/>
              <label for="text" id="item-label">${value}</label>
            </div>
            <div class="list-btns">
              <button class="edit" onclick="editItem(event)">Edit</button>
              <button class="delete">Delete</button>
            </div>
          </div>`;
  const deleteBtn = element.querySelector(".delete");
  const editBtn = element.querySelector(".edit");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  //apend child
  list.appendChild(element);
}
