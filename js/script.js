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

const createTaskElement = (task) => {
  const element = document.createElement('p');
  element.className = 'draggable';
  element.setAttribute('draggable', true);
  element.textContent = task;
  return element;
};

const addTasks = () => {
  allTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    containerNewTask.appendChild(taskElement);

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

  const inputValue = input.value;
  allTasks.push(inputValue);
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  addTasks();
};

form.addEventListener('submit', handleSubmit);

window.onload = () => {
  addTasks();
};
