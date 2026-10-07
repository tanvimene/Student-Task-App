let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [
  {
    id: 1,
    title: "Complete Book Website",
    description: "Finish the responsive book website using HTML, CSS and JavaScript.",
    category: "Assignment",
    priority: "High",
    dueDate: "2026-10-24",
    status: "Pending"
  },
  {
    id: 2,
    title: "Learn MongoDB",
    description: "Practice MongoDB collections, documents and CRUD operations.",
    category: "Study",
    priority: "Medium",
    dueDate: "2026-10-22",
    status: "Completed"
  },
  {
    id: 3,
    title: "Study JavaScript Basics",
    description: "Revise variables, functions, arrays and objects in JavaScript.",
    category: "Study",
    priority: "Medium",
    dueDate: "2026-10-25",
    status: "Pending"
  },
  {
    id: 4,
    title: "Complete React Assignment",
    description: "Create React components and implement routing using React Router.",
    category: "Assignment",
    priority: "High",
    dueDate: "2026-10-28",
    status: "Pending"
  }
];

let editId = null;

function saveData() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function displayTasks() {

  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";

  tasks.forEach(task => {

    const priorityClass =
      task.priority === "High"
        ? "priority-high"
        : task.priority === "Medium"
        ? "priority-medium"
        : "priority-low";

    const statusClass =
      task.status === "Completed"
        ? "status-completed"
        : "status-pending";

    const card = document.createElement("div");

    card.className = "task-card";

    card.innerHTML = `
      <div class="card-top">
        <span class="badge">${task.category}</span>
        <span class="badge ${priorityClass}">
          ${task.priority}
        </span>
      </div>

      <h3>${task.title}</h3>

      <p class="description">
        ${task.description}
      </p>

      <div class="task-info">

        <div>
          <p>DUE DATE</p>
          <span>${formatDate(task.dueDate)}</span>
        </div>

        <div>
          <p>STATUS</p>
          <span class="${statusClass}">
            ${task.status}
          </span>
        </div>

      </div>

      <div class="actions">

        <button class="view" onclick="viewTask(${task.id})">
          View
        </button>

        <button class="edit" onclick="editTask(${task.id})">
          Edit
        </button>

        ${
          task.status === "Pending"
          ?
          `<button class="complete" onclick="completeTask(${task.id})">
              Complete
           </button>`
          :
          `<button class="complete" onclick="pendingTask(${task.id})">
              Mark Pending
           </button>`
        }

        <button class="delete" onclick="deleteTask(${task.id})">
          Delete
        </button>

      </div>
    `;

    taskList.appendChild(card);
  });

  updateStats();
}

function updateStats() {

  const total = tasks.length;

  const pending =
    tasks.filter(task => task.status === "Pending").length;

  const completed =
    tasks.filter(task => task.status === "Completed").length;

  const high =
    tasks.filter(task => task.priority === "High").length;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("pendingTasks").textContent = pending;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("highTasks").textContent = high;

  document.getElementById("taskCount").textContent =
    `${total} tasks available`;
}

function openForm() {

  editId = null;

  document.getElementById("formTitle").textContent = "Create a task";

  document.getElementById("taskForm").reset();

  document.getElementById("formModal").style.display = "flex";
}

function closeForm() {
  document.getElementById("formModal").style.display = "none";
}

document.getElementById("taskForm").addEventListener("submit", function(e) {

  e.preventDefault();

  const title =
    document.getElementById("title").value;

  const description =
    document.getElementById("description").value;

  const category =
    document.getElementById("category").value;

  const priority =
    document.getElementById("priority").value;

  const dueDate =
    document.getElementById("dueDate").value;

  if (editId) {

    const task = tasks.find(t => t.id === editId);

    task.title = title;
    task.description = description;
    task.category = category;
    task.priority = priority;
    task.dueDate = dueDate;

  } else {

    tasks.push({
      id: Date.now(),
      title,
      description,
      category,
      priority,
      dueDate,
      status: "Pending"
    });

  }

  saveData();
  displayTasks();
  closeForm();

});

function editTask(id) {

  const task = tasks.find(t => t.id === id);

  editId = id;

  document.getElementById("formTitle").textContent =
    "Update your task";

  document.getElementById("title").value =
    task.title;

  document.getElementById("description").value =
    task.description;

  document.getElementById("category").value =
    task.category;

  document.getElementById("priority").value =
    task.priority;

  document.getElementById("dueDate").value =
    task.dueDate;

  document.getElementById("formModal").style.display =
    "flex";
}

function deleteTask(id) {

  if (confirm("Are you sure you want to delete this task?")) {

    tasks = tasks.filter(task => task.id !== id);

    saveData();
    displayTasks();
  }
}

function completeTask(id) {

  const task = tasks.find(t => t.id === id);

  task.status = "Completed";

  saveData();
  displayTasks();
}

function pendingTask(id) {

  const task = tasks.find(t => t.id === id);

  task.status = "Pending";

  saveData();
  displayTasks();
}

function viewTask(id) {

  const task = tasks.find(t => t.id === id);

  alert(
    "Task: " + task.title +
    "\n\nDescription: " + task.description +
    "\n\nCategory: " + task.category +
    "\nPriority: " + task.priority +
    "\nDue Date: " + formatDate(task.dueDate) +
    "\nStatus: " + task.status
  );
}

function formatDate(date) {

  if (!date) return "";

  const d = new Date(date);

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

displayTasks();