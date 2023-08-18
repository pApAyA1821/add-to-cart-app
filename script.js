import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSetting = {
  databaseURL:
    "https://cart-app-database-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputField = document.getElementById("input-field");
const addBtn = document.getElementById("add-btn");
const shoppingLst = document.getElementById("shopping-lst");

addBtn.addEventListener("click", function () {
  let inputFlValue = inputField.value;
  push(shoppingListInDB, inputFlValue);
  inputFlClr();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let listFromDB = Object.entries(snapshot.val());
    clearShoppingList();
    for (let i = 0; i < listFromDB.length; i++) {
      let currentItem = listFromDB[i];
      appendItemToList(currentItem);
    }
  } else {
    shoppingLst.innerHTML = `No items yet....`;
  }
});

function inputFlClr() {
  inputField.value = "";
}

function clearShoppingList() {
  shoppingLst.innerHTML = "";
}

function appendItemToList(item) {
  let itemId = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;
  shoppingLst.append(newEl);

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemId}`);

    remove(exactLocationOfItemInDB).then(() => {
      console.log("location removed");
    });
  });
}
