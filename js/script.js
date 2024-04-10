const draggables = document.querySelectorAll('.draggable');
const form = document.querySelector('[data-form="form"]');
const input = document.querySelector('[data-form="input"]');
const containers = document.querySelectorAll('.container');
const containerNewTask = document.querySelector('[data-container="new"]');
const dateContainer = document.querySelector('[data-element="main__date"]');
const resetElement = document.querySelector('[data-container="reset"]')

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

const loadDate = () => {
  const dateElement = document.createElement('div');
  const dayElement = document.createElement('div');

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  const dayName = ['monday', 'tuesday', 'wendenday', 'thursday', 'friday', 'saturday', 'sunday'];

  const dateHtml = `
    <p>${year}</p>
    <p>${month}</p>
    <p>${day}</p>    
 `;

  const dayHtml = `
  <p>${dayName[dayOfWeek]}</p>
  `;

  dateElement.className = 'day day-date';
  dayElement.className = 'day day-name';
  dateElement.innerHTML = dateHtml;
  dayElement.innerHTML = dayHtml;
  dateContainer.append(dateElement, dayElement);
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

const resetList = () => {
  const answer = window.confirm("Are you sure you want to reset your to-do list?")
  if (answer) {
    allTasks = []
    updateLocalStorage(allTasks)
    loadTasks()
  }
}

resetElement.addEventListener("click", resetList)
form.addEventListener('submit', handleSubmit);

window.onload = () => {
  loadDate();
  loadTasks();
};
