// ambil element
const todoInput = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const empty = document.getElementById("empty");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const progressEl = document.getElementById("progress");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const searchInput = document.getElementById("searchInput");

// data todo
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// klik add
addBtn.addEventListener("click", () => {
  const title = todoInput.value.trim();
  const date = dateInput.value;

  if (title === "" || date === "") {
    alert("Please fill task and date");
    return;
  }

  const todo = {
    id: Date.now(),
    title: title,
    date: date,
    completed: false
  };

  todos.push(todo);
  saveTodos();

  renderTodos();

  todoInput.value = "";
  dateInput.value = "";
});

// tampilkan todo
function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchKeyword)
  );

  if (todos.length === 0) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
  }

  filteredTodos.forEach((todo) => {
    const row = document.createElement("div");
    row.className = "table-row";

    row.innerHTML = `
      <span>${todo.title}</span>
      <span>${todo.date}</span>
      <span>
        <button class="status-btn ${todo.completed ? "done" : ""}" data-id="${todo.id}">
          ${todo.completed ? "Done" : "Pending"}
        </button>
      </span>
      <span>
        <button class="delete-btn" data-id="${todo.id}">🗑</button>
      </span>
    `;

    todoList.appendChild(row);
  });

  updateStats();
  deleteAllBtn.disabled = todos.length === 0;
}

//function update stats
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;
  progressEl.textContent = progress + "%";
}

//delete logic
todoList.addEventListener("click", (e) => {

  // DELETE
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
  }

  // TOGGLE STATUS
  if (e.target.classList.contains("status-btn")) {
    const id = Number(e.target.dataset.id);
    const todo = todos.find(todo => todo.id === id);
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }

});

//delete all logic
deleteAllBtn.addEventListener("click", () => {
  if (todos.length === 0) return;

  const confirmDelete = confirm("Are you sure you want to delete all tasks?");
  if (!confirmDelete) return;

  todos = [];
  saveTodos();
  renderTodos();
});
deleteAllBtn.disabled = todos.length === 0;

let searchKeyword = "";
searchInput.addEventListener("input", (e) => {
  searchKeyword = e.target.value.toLowerCase();
  renderTodos();
});

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

renderTodos();


