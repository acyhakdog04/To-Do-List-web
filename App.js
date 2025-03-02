import React, { useState, useEffect } from "react";
import "./App.css";

const ToDoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [deletedTasks, setDeletedTasks] = useState(() => {
    const storedDeletedTasks = localStorage.getItem("deletedTasks");
    return storedDeletedTasks ? JSON.parse(storedDeletedTasks) : [];
  });

  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedDeleted, setSelectedDeleted] = useState([]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
  }, [deletedTasks]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask("");
    }
  };

  const toggleComplete = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (index) => {
    const taskToDelete = tasks[index];
    setDeletedTasks([...deletedTasks, taskToDelete]);
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const restoreTask = (index) => {
    const taskToRestore = deletedTasks[index];
    setTasks([...tasks, taskToRestore]);
    setDeletedTasks(deletedTasks.filter((_, i) => i !== index));
  };

  const toggleSelectDeleted = (index) => {
    setSelectedDeleted((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const deleteSelectedTasks = () => {
    setDeletedTasks(deletedTasks.filter((_, i) => !selectedDeleted.includes(i)));
    setSelectedDeleted([]);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">✅ To-Do List</h1>
        <div className="relative menu-container">
          <button
            className="menu-button"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            ⋯
          </button>
          {showFilterMenu && (
            <div className="menu-dropdown">
              <button onClick={() => setFilter("all")}>📋 All</button>
              <button onClick={() => setFilter("completed")}>✅ Completed</button>
              <button onClick={() => setFilter("incomplete")}>⏳ Incomplete</button>
              <button onClick={() => setFilter("deleted")}>🗑 Deleted</button>
            </div>
          )}
        </div>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="✍️ Enter a task..."
        />
        <button onClick={addTask}>➕</button>
      </div>

      {/* Active Task List */}
      {filter !== "deleted" && (
        <ul>
          {filteredTasks.map((t, index) => (
            <li key={index} className="task-item">
              <span className={`task-text ${t.completed ? "completed" : ""}`}>
                {t.text}
              </span>
              <div className="task-actions">
                <button onClick={() => toggleComplete(index)}>✅</button>
                <button onClick={() => deleteTask(index)}>❌</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Deleted Task List */}
      {filter === "deleted" && (
        <>
          <ul className="deleted-task-list">
            {deletedTasks.map((t, index) => (
              <li key={index} className="deleted-item">
                <input
                  type="checkbox"
                  checked={selectedDeleted.includes(index)}
                  onChange={() => toggleSelectDeleted(index)}
                  className="checkbox"
                />
                <span className="task-text">{t.text}</span>
                <button onClick={() => restoreTask(index)} className="restore-btn">🔄 Restore</button>
              </li>
            ))}
          </ul>
          {selectedDeleted.length > 0 && (
            <button onClick={deleteSelectedTasks} className="delete-selected-btn">
              🗑 Delete Selected
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ToDoApp;
