// get elements and assign to variables
const pageContentEl = document.querySelector('#page-content');
const formEl = document.querySelector('#task-form');
const tasksToDoEl = document.querySelector('#tasks-to-do');
const tasksInProgressEl = document.querySelector('#tasks-in-progress');
const tasksCompletedEl = document.querySelector('#tasks-completed');

// define empty array to utilize local storage for persistence
let tasks = [];

// variable to assign id to tasks
let taskIdCounter = 0;

const taskFormHandler = (event) => {
  event.preventDefault();

  // get user's inputted values
  const taskNameInput = document.querySelector('input[name="task-name"]').value;
  const taskTypeInput = document.querySelector('select[name="task-type"]').value;

  // check if input values are empty
  if (!taskNameInput) {
    alert("You gotta put in a task, silly!");
    return;
  };

  if (!taskTypeInput) {
    alert("You gotta pick a type, goober!");
    return;
  };

  // variable to find out if editing task
  const isEdit = formEl.hasAttribute('data-task-id');

  // has data attribute, get task id and call function to complete task edit
  if (isEdit) {
    const taskId = formEl.getAttribute('data-task-id');
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, create task as normal
  else {
    const taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: 'to do'
    };

    // send it to createTaskEl function
    createTaskEl(taskDataObj);
  };

  formEl.reset();
};

const createTaskEl = taskDataObj => {
  // create li element for task list
  const listItemEl = document.createElement('li');
  listItemEl.className = 'task-item';

  // add id as attribute and make draggable
  listItemEl.setAttribute('data-task-id', taskIdCounter);
  listItemEl.setAttribute('draggable', 'true');


  // create div element to hold task info and add it to the li element: listItemEl
  const taskInfoEl = document.createElement('div');
  taskInfoEl.className = 'task-info';
  taskInfoEl.innerHTML = `<h3 class='task-name'>${taskDataObj.name}</h3><span class='task-type'>${taskDataObj.type}</span>`;
  listItemEl.appendChild(taskInfoEl);

  // add id to task object and push to tasks array for persistence
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  saveTasks();
  
  // get task actions container with unique id
  const taskActionsEl = createTaskActions(taskDataObj);

  // add actions container to task list item
  listItemEl.appendChild(taskActionsEl);

  switch (taskDataObj.status) {
    case 'in progress':
      tasksInProgressEl.appendChild(listItemEl);
      break;
    case 'completed':
      tasksCompletedEl.appendChild(listItemEl);
      break;
    default:
      tasksToDoEl.appendChild(listItemEl);
      break;
  }

  // increase id taskIdCounter
  taskIdCounter++;
};

const createTaskActions = ({id, status}) => {
  // create div to hold actions
  const taskActionContainerEl = document.createElement('div');
  taskActionContainerEl.className = 'task-actions';

  // create edit button and assign same id as task
  const taskEditButtonEl = document.createElement('button');
  taskEditButtonEl.textContent = 'Edit';
  taskEditButtonEl.className = 'btn edit-btn';
  taskEditButtonEl.setAttribute('data-task-id', id);

  // add edit button to div
  taskActionContainerEl.appendChild(taskEditButtonEl);

  // create delete button and assign same id as task
  const taskDeleteButtonEl = document.createElement('button');
  taskDeleteButtonEl.textContent = 'Delete';
  taskDeleteButtonEl.className = 'btn delete-btn';
  taskDeleteButtonEl.setAttribute('data-task-id', id);

  // add delete button to div
  taskActionContainerEl.appendChild(taskDeleteButtonEl);

  // create dropdown and assign same id as task and name as status-change
  const taskStatusSelectorEl = document.createElement('select');
  taskStatusSelectorEl.className = 'select-status';
  taskStatusSelectorEl.setAttribute('name', 'status-change');
  taskStatusSelectorEl.setAttribute('data-task-id', id);

  // add options to dropdown
  // create array to hold options
  const taskStatusOptions = ['To Do', 'In Progress', 'Completed'];

  // loop through options array and create option elements for each
  taskStatusOptions.forEach(option => {
    // create option element
    const taskStatusOptionEl = document.createElement('option');
    taskStatusOptionEl.textContent = option;
    taskStatusOptionEl.setAttribute('value', option);

    // append to dropdown
    taskStatusSelectorEl.appendChild(taskStatusOptionEl);
  })

  switch (status) {
    case 'in progress':
      taskStatusSelectorEl.selectedIndex = 1;
      break;
    case 'completed':
      taskStatusSelectorEl.selectedIndex = 2;
      break;
    default:
      break;
  }
  // add dropdown to div
  taskActionContainerEl.appendChild(taskStatusSelectorEl);

  // return completed container
  return taskActionContainerEl;
};

const taskButtonHandler = event => {
  // get target element from click event
  const targetEl = event.target;

  // delete button was clicked
  if (targetEl.matches('.delete-btn')) {
    // get the id from data-task-id attribute
    const taskId = event.target.getAttribute('data-task-id');
    // send id to deleteTask function
    deleteTask(taskId);
  }
  //edit button was clicked
  else if (targetEl.matches('.edit-btn')) {
    // get the id from the data-task-id attribute
    const taskId = targetEl.getAttribute('data-task-id');
    // send id to editTask function
    editTask(taskId);
  };
};

// function to handle deleting a task
const deleteTask = taskId => {
  // get task list item element
  const taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);
  // delete it
  taskSelected.remove();

  // persistence functionality below
  let updatedTaskArr = [];

  // loop through current tasks
  for (let i = 0; i < tasks.length; i++) {
    // if tasks[i].id does not match the value of taskId, let's keep that task in the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    };
  };
  console.log(updatedTaskArr);
  // reassign tasks array to be same as updatedTaskArr
  tasks = updatedTaskArr;

  saveTasks();
};

const editTask = taskId => {
  // get task list item element
  const taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);

  // get content from task name and type
  const taskName = taskSelected.querySelector('h3.task-name').textContent;
  const taskType = taskSelected.querySelector('span.task-type').textContent;

  // put task name and type into form and change 'add task' button text
  document.querySelector('input[name="task-name"]').value = taskName;
  document.querySelector('select[name="task-type"]').value = taskType;
  document.querySelector('#save-task').textContent = 'Save Task';

  // add task id to form element
  formEl.setAttribute('data-task-id', taskId);
};

const completeEditTask = (taskName, taskType, taskId) => {
  // find matching task list item
  const taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);

  // set new values
  taskSelected.querySelector('h3.task-name').textContent = taskName;
  taskSelected.querySelector('span.task-type').textContent = taskType;

  // loop through tasks array and find appropriate task object then update with new content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };

  saveTasks();

  alert('Task Updated!');

  // remove data attribute from form and change button text to 'Add Task'
  formEl.removeAttribute('data-task-id');
  document.querySelector('#save-task').textContent = 'Add Task';
};

const taskStatusChangeHandler = event => {
  // get the task's id
  const taskId = event.target.getAttribute('data-task-id');

  // get the currently selected option's value and convert to lowercase
  const statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  const taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);


  switch (statusValue) {
    case 'to do':
      tasksToDoEl.appendChild(taskSelected);
      break;
    case 'in progress':
      tasksInProgressEl.appendChild(taskSelected);
      break;
    case 'completed':
      tasksCompletedEl.appendChild(taskSelected);
      break;
    default:
      break;
  };

  // persistence functionality below
  // update tasks in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    };
  };
  saveTasks();
};

const dragTaskHandler = event => {
  // get task id
  const taskId = event.target.getAttribute('data-task-id');

  // set task id to data transfer property
  event.dataTransfer.setData('text/plain', taskId);
}

const dropZoneDragHandler = event => {
  // assign variable to drop zone
  const taskListEl = event.target.closest('.task-list');

  // ensure the task is over an appropriate element
  if (taskListEl) {
    event.preventDefault();
  }

  taskListEl.classList.add('drag-over');
}

const dragLeaveHandler = event => {
  const taskListEl = event.target.closest('.task-list');
  if (taskListEl) {
    taskListEl.classList.remove('drag-over');
  }
}

const dropTaskHandler = event => {
  // get task id from data transfer property
  const id = event.dataTransfer.getData('text/plain');

  // get draggable element by id
  const draggableElement = document.querySelector(`[data-task-id='${id}']`);

  // get closest ancestor and id
  const dropZoneEl = event.target.closest('.task-list');
  const statusType = dropZoneEl.id;

  // set status of task based on dropZone id
  const statusSelectEl = draggableElement.querySelector('select[name="status-change"]');

  if (statusType === "tasks-to-do") {
    statusSelectEl.selectedIndex = 0;
  }
  else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
  }
  else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
  };

  // add draggableElement to new task list
  dropZoneEl.appendChild(draggableElement);

  // remove hover styling
  dropZoneEl.classList.remove('drag-over');

  // persistence functionality below
  // loop through tasks array to find and update the updated task's status
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(id)) {
      tasks[i].status = statusSelectEl.value.toLowerCase();
    };
  };

  saveTasks();
}

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const loadTasks = () => {
  let savedTasks = localStorage.getItem('tasks');
  if (!savedTasks) {
    return false;
  }

  savedTasks = JSON.parse(savedTasks);

  savedTasks.forEach(task => createTaskEl(task));
} 

loadTasks();

pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener('change', taskStatusChangeHandler);
pageContentEl.addEventListener('dragstart', dragTaskHandler);
pageContentEl.addEventListener('dragover', dropZoneDragHandler);
pageContentEl.addEventListener('dragleave', dragLeaveHandler);
pageContentEl.addEventListener('drop', dropTaskHandler);
formEl.addEventListener('submit', taskFormHandler);