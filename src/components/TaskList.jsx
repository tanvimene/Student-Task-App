import { useEffect, useState } from "react";
import "../TaskList.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const getTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch tasks");
        return;
      }

      setTasks(data);
    } catch (error) {
      console.log("Fetch Error:", error);
      alert("Server connection error");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // ADD TASK
  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          dueDate: dueDate || null,
          completed: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Task not added");
        return;
      }

      alert("Task Added Successfully!");

      setTitle("");
      setDescription("");
      setCategory("Other");
      setPriority("Medium");
      setDueDate("");

      getTasks();
    } catch (error) {
      console.log("Add Error:", error);
      alert("Server connection error");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Task delete failed");
        return;
      }

      alert("Task deleted successfully!");
      getTasks();
    } catch (error) {
      console.log("Delete Error:", error);
      alert("Server connection error");
    }
  };

  // EDIT TASK
  const editTask = async (task) => {
    const newTitle = prompt(
      "Enter new task title",
      task.title
    );

    if (newTitle === null || !newTitle.trim()) {
      return;
    }

    const newDescription = prompt(
      "Enter new description",
      task.description || ""
    );

    const newCategory = prompt(
      "Category: Study / Assignment / Exam / Personal / Other",
      task.category || "Other"
    );

    const newPriority = prompt(
      "Priority: Low / Medium / High",
      task.priority || "Medium"
    );

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTitle,
            description: newDescription || "",
            category: newCategory || "Other",
            priority: newPriority || "Medium",
            dueDate: task.dueDate || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Task update failed");
        return;
      }

      alert("Task updated successfully!");
      getTasks();
    } catch (error) {
      console.log("Edit Error:", error);
      alert("Server connection error");
    }
  };

  // COMPLETE / UNDO
  const toggleTask = async (task) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !task.completed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Task update failed");
        return;
      }

      getTasks();
    } catch (error) {
      console.log("Complete Error:", error);
      alert("Server connection error");
    }
  };

  return (
    <div className="task-container">

      <h1>Student Task App</h1>

      <input
        type="text"
        className="task-input"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        className="task-input"
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      {/* CATEGORY */}
      <select
        className="task-input"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Study">Study</option>
        <option value="Assignment">Assignment</option>
        <option value="Exam">Exam</option>
        <option value="Personal">Personal</option>
        <option value="Other">Other</option>
      </select>

      <br />
      <br />

      {/* PRIORITY */}
      <select
        className="task-input"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <br />
      <br />

      {/* DUE DATE */}
      <input
        type="date"
        className="task-input"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <br />
      <br />

      <button
        className="task-button"
        onClick={addTask}
      >
        Add Task
      </button>

      <h2>My Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map((task) => (
          <div
            className="task-card"
            key={task._id}
          >

            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
              <strong>Category:</strong>{" "}
              {task.category || "Other"}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {task.priority || "Medium"}
            </p>

            <p>
              <strong>Due Date:</strong>{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "Not set"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {task.completed
                ? "Completed"
                : "Pending"}
            </p>

            <button
              onClick={() => editTask(task)}
            >
              Edit
            </button>

            <button
              onClick={() => toggleTask(task)}
            >
              {task.completed
                ? "Undo"
                : "Complete"}
            </button>

            <button
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default TaskList;