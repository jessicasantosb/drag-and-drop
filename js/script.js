const draggables = document.querySelectorAll('.draggable');
const form = document.querySelector('[data-form="form"]');
const input = document.querySelector('[data-form="input"]');
const containers = document.querySelectorAll('.container');
const containerNewTask = document.querySelector('[data-container="new"]');

let list = [
  'build a personal project',
  'contribute to an open-source project',
  'read a tech blog or article',
  'solve a challenging algorithm problem',
  'refactor legacy code',
];

let allTasks = JSON.parse(localStorage.getItem('tasks')) || list;

const updateLocalStorage = (newArray) => {
  localStorage.setItem('tasks', JSON.stringify(newArray));
};

const addTask = () => {
  const inputValue = input.value;
  allTasks.push(inputValue);
  input.value = '';
  updateLocalStorage(allTasks);
  loadTasks();
};

const createTaskElement = (task, id) => {
  const element = document.createElement('p');
  element.className = 'draggable';
  element.dataset.draggable = true;
  element.dataset.trash = id;
  element.textContent = task;
  return element;
};

const createDeleteIcon = (id) => {
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-trash';
  icon.addEventListener('click', () => {
    const updatedItems = allTasks.filter((task, index) => index !== id);
    console.log(updatedItems);
    updateLocalStorage(updatedItems);
    const element = document.querySelector(`[data-trash="${id}"]`);
    element.remove();
  });
  return icon;
};

const loadTasks = () => {
  containerNewTask.innerHTML = '';

  allTasks.forEach((task, index) => {
    const taskElement = createTaskElement(task, index);
    const deleteIcon = createDeleteIcon(index);

    containerNewTask.appendChild(taskElement);
    taskElement.appendChild(deleteIcon);

    taskElement.addEventListener('dragstart', () => {
      taskElement.classList.add('dragging');
    });

    taskElement.addEventListener('dragend', () => {
      taskElement.classList.remove('dragging');
    });
  });
};

containers.forEach((container) => {
  container.addEventListener('dragover', (event) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(container, event.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

const getDragAfterElement = (container, y) => {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

  return draggableElements.reduce(
    (closest, child) => {
      const container = child.getBoundingClientRect();
      const offset = y - container.top - container.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
};

const handleSubmit = (event) => {
  event.preventDefault();

  addTask();
};

form.addEventListener('submit', handleSubmit);

window.onload = () => {
  loadTasks();
};
