const draggables = document.querySelectorAll('.draggable');
const form = document.querySelector('[data-form="form"]');
const input = document.querySelector('[data-form="input"]');
const containers = document.querySelector('[data-element="containers"]');
const containerNewTask = document.querySelector('[data-container="new"]');

let list = [
  'build a personal project',
  'contribute to an open-source project',
  'read a tech blog or article',
  'solve a challenging algorithm problem',
  'refactor legacy code',
];

let newTasks = [];

const handlenewTasks = ({ target }) => {
  newTasks.push(target.value);
};

const createTaskElement = (task) => {
  const element = document.createElement('p');
  element.className = 'draggable';
  element.setAttribute('draggable', true);
  element.textContent = task;
  return element;
};

const loadTasks = () => {
  list.forEach((task) => {
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

const handleDraggingElement = (container) => {
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
};

const handleContainerClick = ({ target }) => {
  const isContainer = target.dataset.container;

  if (!isContainer) return null;
  if (isContainer) return handleDraggingElement(target);
};

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
};

containers.addEventListener('click', handleContainerClick);
input.addEventListener('change', handlenewTasks);
form.addEventListener('submit', handleSubmit);

window.onload = () => {
  loadTasks();
};
