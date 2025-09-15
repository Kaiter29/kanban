let board = [
  {
    id: 1,
    title: "A fazer",
    tasks: [
      { id: 101, title: "Analisar requisitos", description: "Verificar o que precisa ser feito." },
      { id: 102, title: "Criar layout", description: "Desenhar a interface no Figma." }
    ]
  },
  {
    id: 2,
    title: "Em andamento",
    tasks: []
  },
  {
    id: 3,
    title: "Concluído",
    tasks: []
  }
];

const columnContainer = document.querySelector(".column-container");

function renderBoard() {
  columnContainer.innerHTML = '';

  board.forEach(column => {
    const taskColumn = document.createElement('div');
    taskColumn.classList.add('task-column');
    taskColumn.dataset.columnId = column.id;
    taskColumn.style.position = 'relative';

    taskColumn.innerHTML = `
      <div class="column-header-actions">
        <h3 class="column-title-display">${column.title}</h3>
        <button class="column-options-btn" data-column-id="${column.id}">...</button>
        <div class="column-options-menu" data-column-id="${column.id}">
          <button class="edit-column-btn">Editar</button>
          <button class="delete-column-btn">Excluir</button>
        </div>
      </div>
      <hr class="custom-hr" />
      <div class="task-list"></div>
    `;

    const taskList = taskColumn.querySelector('.task-list');

    column.tasks.forEach(task => {
      const taskCard = document.createElement('div');
      taskCard.classList.add('task-container');
      taskCard.setAttribute('draggable', true);
      taskCard.dataset.taskId = task.id;
      taskCard.dataset.columnId = column.id;

      taskCard.innerHTML = `
        <div class="task-header">
          <p class="task-title-display">${task.title}</p>
          <p class="edit-task" style="cursor: pointer; font-size: 0.8em; margin-left: auto; margin-right: 5px;">Editar</p>
          <p class="delete-task" style="cursor: pointer;">X</p>
        </div>
        <div class="task-description-container">
          <p class="task-description-display">${task.description}</p>
        </div>
      `;
      taskList.appendChild(taskCard);
    });
    columnContainer.appendChild(taskColumn);
  });
  addEventListeners();
}

function addEventListeners() {
  document.querySelectorAll('.delete-task').forEach(button => {
    button.onclick = deleteTask;
  });
  document.querySelectorAll('.edit-task').forEach(button => {
    button.onclick = editTask;
  });

  const tasks = document.querySelectorAll('.task-container');
  tasks.forEach(task => {
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
  });

  const columns = document.querySelectorAll('.task-column');
  columns.forEach(column => {
    column.addEventListener('dragover', dragOver);
    column.addEventListener('drop', dragDrop);
  });

  document.querySelectorAll('.column-options-btn').forEach(btn => {
    btn.onclick = toggleColumnMenu;
  });
  document.querySelectorAll('.edit-column-btn').forEach(btn => {
    btn.onclick = editColumn;
  });
  document.querySelectorAll('.delete-column-btn').forEach(btn => {
    btn.onclick = deleteColumn;
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.column-options-menu').forEach(menu => {
      if (menu.style.display === 'block' && !menu.contains(event.target) && !event.target.classList.contains('column-options-btn')) {
        menu.style.display = 'none';
      }
    });
  });
}

function toggleColumnMenu(event) {
  event.stopPropagation();
  const columnId = Number(event.target.dataset.columnId);
  const menu = document.querySelector(`.column-options-menu[data-column-id="${columnId}"]`);

  document.querySelectorAll('.column-options-menu').forEach(otherMenu => {
    if (otherMenu !== menu) {
      otherMenu.style.display = 'none';
    }
  });
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function editColumn(event) {
    const menu = event.target.closest('.column-options-menu');
    const columnId = Number(menu.dataset.columnId);
    const columnElement = document.querySelector(`.task-column[data-column-id="${columnId}"]`);
    const titleDisplay = columnElement.querySelector('.column-title-display');
  
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('edit-column-title-input');
    input.value = titleDisplay.textContent;
    
    titleDisplay.style.display = 'none';
    titleDisplay.parentNode.insertBefore(input, titleDisplay);
    input.focus();
  
    const save = () => {
      const newTitle = input.value.trim();
      if (newTitle) {
        const columnToEdit = board.find(col => col.id === columnId);
        if (columnToEdit) {
          columnToEdit.title = newTitle;
        }
      } else {
        showError("O título da coluna não pode ser vazio!");
      }
      renderBoard();
    };
  
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        save();
      }
    });
  
    input.addEventListener('blur', save);
    
    menu.style.display = 'none';
  }

function deleteColumn(event) {
  const menu = event.target.closest('.column-options-menu');
  const columnId = Number(menu.dataset.columnId);

  if (confirm("Tem certeza que deseja excluir esta coluna? Todas as tarefas nela serão perdidas!")) {
    board = board.filter(column => column.id !== columnId);
    renderBoard();
  }
  menu.style.display = 'none';
}

function editTask(event) {
  const taskCard = event.target.closest('.task-container');
  const taskId = Number(taskCard.dataset.taskId);
  const columnId = Number(taskCard.dataset.columnId);

  const titleDisplay = taskCard.querySelector('.task-title-display');
  const descriptionDisplay = taskCard.querySelector('.task-description-display');
  
  if (taskCard.querySelector('.edit-task-input')) {
    return;
  }

  titleDisplay.style.display = 'none';
  descriptionDisplay.style.display = 'none';
  taskCard.querySelector('.edit-task').style.display = 'none';
  taskCard.querySelector('.delete-task').style.display = 'none';

  const titleInputEdit = document.createElement('input');
  titleInputEdit.type = 'text';
  titleInputEdit.value = titleDisplay.textContent;
  titleInputEdit.classList.add('edit-task-input');
  
  const descriptionInputEdit = document.createElement('textarea');
  descriptionInputEdit.value = descriptionDisplay.textContent;
  descriptionInputEdit.classList.add('edit-task-textarea');
  
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Salvar';
  saveBtn.classList.add('save-task-btn');
  
  titleDisplay.parentNode.insertBefore(titleInputEdit, titleDisplay);
  descriptionDisplay.parentNode.insertBefore(descriptionInputEdit, descriptionDisplay);
  taskCard.appendChild(saveBtn);
  
  titleInputEdit.focus();

  const saveChanges = () => {
    const newTitle = titleInputEdit.value.trim();
    const newDescription = descriptionInputEdit.value.trim();

    if (newTitle && newDescription) {
        const column = board.find(col => col.id === columnId);
        if (column) {
            const task = column.tasks.find(t => t.id === taskId);
            if (task) {
                task.title = newTitle;
                task.description = newDescription;
            }
        }
    } else {
        showError("Título e descrição da tarefa não podem ser vazios!");
    }
    renderBoard();
  };
  
  saveBtn.onclick = saveChanges;

  descriptionInputEdit.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        saveChanges();
    }
  });
}


function addColumn() {
  const title = document.querySelector("#title-column").value.trim();
  if (title) {
    const newColumn = {
      id: Date.now(),
      title: title,
      tasks: []
    };
    board.push(newColumn);
    renderBoard();
    closeAddColumn();
    document.querySelector("#title-column").value = '';
  }
}

function addTask(e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (title && description) {
    const newTask = {
      id: Date.now(),
      title: title,
      description: description
    };
    board[0].tasks.push(newTask);
    renderBoard();
    closeAddCard();
    titleInput.value = '';
    descriptionInput.value = '';
  } else {
    showError("Título e descrição são obrigatórios!");
  }
}

function deleteTask(event) {
  const taskElement = event.target.closest('.task-container');
  const taskId = Number(taskElement.dataset.taskId);

  board.forEach(column => {
    column.tasks = column.tasks.filter(task => task.id !== taskId);
  });
  renderBoard();
}

let draggedTaskId = null;

function dragStart(event) {
  draggedTaskId = Number(event.target.dataset.taskId);
  setTimeout(() => {
    event.target.classList.add('is-dragging');
  }, 0);
}

function dragEnd(event) {
    event.target.classList.remove('is-dragging');
}

function dragOver(event) {
  event.preventDefault();
}

function dragDrop(event) {
  event.preventDefault();
  const columnElement = event.target.closest('.task-column');
  if (!columnElement) return;

  const destColumnId = Number(columnElement.dataset.columnId);
  let taskToMove;
  let originColumn;

  board.forEach(column => {
    const task = column.tasks.find(t => t.id === draggedTaskId);
    if (task) {
      taskToMove = task;
      originColumn = column;
    }
  });

  if (originColumn && taskToMove && originColumn.id !== destColumnId) {
    originColumn.tasks = originColumn.tasks.filter(t => t.id !== draggedTaskId);
    const destColumn = board.find(c => c.id === destColumnId);
    if (destColumn) {
      destColumn.tasks.push(taskToMove);
    }
    renderBoard();
  }
}

const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const submitAddCard = document.querySelector("#submit-card");
const submitAddColumn = document.querySelector("#submit-column");
const errorContainer = document.querySelector(".error-container");

function openAddColumn() { document.getElementById('input-column').style.display = 'block'; }
function closeAddColumn() { document.getElementById('input-column').style.display = 'none'; }
function openAddCard() { document.getElementById('input-card').style.display = 'block'; }
function closeAddCard() { document.getElementById('input-card').style.display = 'none'; }

function showError(message) {
  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  errorMessage.classList.add("error-message");
  errorContainer.innerHTML = '';
  errorContainer.append(errorMessage);
  setTimeout(() => { errorContainer.textContent = ""; }, 3000);
}

submitAddCard.addEventListener("click", addTask);
submitAddColumn.addEventListener("click", (e) => {
    e.preventDefault();
    addColumn();
});

document.addEventListener('DOMContentLoaded', renderBoard);