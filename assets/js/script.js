var buttonEl = document.querySelector("#save-task");
var tasksToDoEL = document.querySelector("#tasks-to-do");
var createTaskHandler = function() {
    var listItemEL = document.createElement("li");
    listItemEL.className = "task-item";
    listItemEL.textContent = "This is a new task.";
    tasksToDoEL.appendChild(listItemEL);
    console.log(listItemEL);
}

buttonEl.addEventListener("click", createTaskHandler);
