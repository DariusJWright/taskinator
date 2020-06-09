var formEL = document.querySelector("#task-form");
var tasksToDoEL = document.querySelector("#tasks-to-do");
var createTaskHandler = function(event) {
    event.preventDefault();

    var listItemEL = document.createElement("li");
    listItemEL.className = "task-item";
    listItemEL.textContent = "This is a new task.";
    tasksToDoEL.appendChild(listItemEL);
}

formEL.addEventListener("submit", createTaskHandler);
