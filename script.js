const data = ["Item 1", "Item 2", ["Subitem 2.1", "Subitem 2.2", ["Sub-Subitem 2.2.1", "Sub-Subitem 2.2.2"]], "Item 3"];

function createListItems(parentElement, dataArray) {
    dataArray.forEach(item => {
        if (Array.isArray(item)) {
            const sublist = document.createElement("ul");
            parentElement.appendChild(sublist);
            createListItems(sublist, item);
        } else {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            listItem.addEventListener("click", () => {
                listItem.classList.toggle("on"); // Toggle the "on" class on click
            });
            parentElement.appendChild(listItem);
        }
    });
}

const myListElement = document.getElementById("system-list");
createListItems(myListElement, data);