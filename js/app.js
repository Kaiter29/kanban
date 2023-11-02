const taskLists = document.querySelectorAll(".task-list");
const cardTasks = document.querySelector("#card .task-list");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const submitButton = document.querySelector("#submit-button");
const errorContainer = document.querySelector(".error-container");

let tasks = [];

function abreAddColuna() {
    document.getElementById('input-container').style.display = 'block';
}

function fechaAddColuna() {
    document.getElementById('input-container').style.display = 'none';
}

function AbreAddCard() {
    document.getElementById('input-container').style.display = 'block';
}

function fechaAddCard() {
    document.getElementById('input-container').style.display = 'none';
}

taskLists.forEach((taskList) => {
  taskList.addEventListener("dragover", dragOver);
  taskList.addEventListener("drop", dragDrop);
});

function createTask(taskId, title, description) {
  const taskCard = document.createElement("div");
  const taskHeader = document.createElement("div");
  const taskTitle = document.createElement("p");
  const taskDescriptionContainer = document.createElement("div");
  const taskDescription = document.createElement("p");
  const deleteIcon = document.createElement("p");

  taskCard.classList.add("task-container");
  taskHeader.classList.add("task-header");
  taskDescriptionContainer.classList.add("task-description-container");

  taskTitle.textContent = title;
  taskDescription.textContent = description;
  deleteIcon.textContent = "Excluir";

  taskCard.setAttribute("draggable", true);
  taskCard.setAttribute("task-id", taskId);

  taskCard.addEventListener("dragstart", dragStart);
  deleteIcon.addEventListener("click", deleteTask);

  taskHeader.append(taskTitle, deleteIcon);
  taskDescriptionContainer.append(taskDescription);
  taskCard.append(taskHeader, taskDescriptionContainer);
  cardTasks.append(taskCard);
}

function addColor(column) {
  let color;
  switch (column) {
    case "analise":
      color = "rgb(96, 96, 192)";
      break;
    case "alinhamento":
      color = "rgb(83, 156, 174)";
      break;
    case "desenvolvimento":
      color = "rgb(224, 165, 116)";
      break;
    case "codereview":
      color = "rgb(222, 208, 130)";
      break;
    default:
      color = "rgb(232, 232, 232)";
  }
  return color;
}

function addTasks() {
  tasks.forEach((task) => createTask(task.id, task.title, task.description));
}

addTasks();

let elementBeingDragged;

function dragStart() {
  elementBeingDragged = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop() {
  const columnId = this.parentNode.id;
  elementBeingDragged.firstChild.style.backgroundColor = addColor(columnId);
  this.append(elementBeingDragged);
}

function showError(message) {
  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  errorMessage.classList.add("error-message");
  errorContainer.append(errorMessage);

  setTimeout(() => {
    errorContainer.textContent = "";
  }, 2000);
}

function addTask(e) {
  e.preventDefault();
  const filteredTitles = tasks.filter((task) => {
    return task.title === titleInput.value;
  });

  if (!filteredTitles.length) {
    const newId = tasks.length;
    tasks.push({
      id: newId,
      title: titleInput.value,
      description: descriptionInput.value
    });
    createTask(newId, titleInput.value, descriptionInput.value);
    titleInput.value = "";
    descriptionInput.value = "";
  } else {
    showError("Título em uso!");
  }
}
submitButton.addEventListener("click", addTask);

function deleteTask() {
  const headerTitle = this.parentNode.firstChild.textContent;

  const filteredTasks = tasks.filter((task) => {
    return task.title === headerTitle;
  });

  tasks = tasks.filter((task) => {
    return task !== filteredTasks[0];
  });

  this.parentNode.parentNode.remove();
}
