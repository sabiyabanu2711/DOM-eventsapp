/**
 * TaskMaster — DOM & Events Application
 * Week 2 Project: To-Do App with Add, Delete, Filter, and LocalStorage
 */

"use strict";

// ==========================================
// 1. STATE MANAGEMENT & CONSTANTS
// ==========================================
const STORAGE_KEY = "taskmaster_todos_v1";
const THEME_KEY = "taskmaster_theme";

// Application State
let todos = [];
let currentFilter = "all"; // 'all' | 'active' | 'completed'
let searchQuery = "";
let editingId = null;

// ==========================================
// 2. DOM ELEMENT REFERENCES
// ==========================================
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const inputFeedback = document.getElementById("inputFeedback");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptySubtitle = document.getElementById("emptySubtitle");

// Counters & Badges
const totalTasksCount = document.getElementById("totalTasksCount");
const activeTasksCount = document.getElementById("activeTasksCount");
const completedTasksCount = document.getElementById("completedTasksCount");
const badgeAll = document.getElementById("badgeAll");
const badgeActive = document.getElementById("badgeActive");
const badgeCompleted = document.getElementById("badgeCompleted");

// Controls
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const currentDateEl = document.getElementById("currentDate");

// ==========================================
// 3. INITIALIZATION & STORAGE
// ==========================================

/**
 * Load todos from localStorage
 */
function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      todos = JSON.parse(stored);
    } else {
      // Default initial welcome tasks if storage is empty
      todos = [
        {
          id: "task-1",
          text: "Review Week 2 DOM & Events concepts",
          completed: true,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: "task-2",
          text: "Test adding, filtering, and deleting tasks",
          completed: false,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: "task-3",
          text: "Submit the project link before deadline",
          completed: false,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      saveTodos();
    }
  } catch (err) {
    console.error("Error reading from localStorage:", err);
    todos = [];
  }
}

/**
 * Persist current todos to localStorage
 */
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    console.error("Error saving to localStorage:", err);
  }
}

/**
 * Format and set current date in header
 */
function displayCurrentDate() {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const today = new Date().toLocaleDateString(undefined, options);
  if (currentDateEl) {
    currentDateEl.textContent = `${today} • Keep moving forward`;
  }
}

/**
 * Initialize theme from localStorage or system preference
 */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// ==========================================
// 4. CORE ACTIONS (ADD, TOGGLE, DELETE, EDIT)
// ==========================================

/**
 * Add a new todo item
 * @param {string} text - Task text
 */
function addTodo(text) {
  const trimmed = text.trim();
  
  // Validation
  if (!trimmed) {
    showInputError("Task description cannot be empty.");
    return false;
  }

  // Duplicate check (optional warning)
  const isDuplicate = todos.some(
    (t) => t.text.toLowerCase() === trimmed.toLowerCase()
  );
  if (isDuplicate) {
    showInputError("This task already exists in your list.");
    return false;
  }

  hideInputError();

  const newTodo = {
    id: "task-" + Date.now(),
    text: trimmed,
    completed: false,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  todos.unshift(newTodo); // Add to top
  saveTodos();
  render();
  return true;
}

/**
 * Toggle task completion status
 * @param {string} id - Task identifier
 */
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  render();
}

/**
 * Delete a single task
 * @param {string} id - Task identifier
 */
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

/**
 * Update task text
 * @param {string} id - Task identifier
 * @param {string} newText - New updated text
 */
function updateTodoText(id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) {
    deleteTodo(id);
    return;
  }
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, text: trimmed };
    }
    return todo;
  });
  editingId = null;
  saveTodos();
  render();
}

/**
 * Clear all completed tasks
 */
function clearCompleted() {
  const completedCount = todos.filter(t => t.completed).length;
  if (completedCount === 0) return;

  if (confirm(`Are you sure you want to delete all ${completedCount} completed task(s)?`)) {
    todos = todos.filter((todo) => !todo.completed);
    saveTodos();
    render();
  }
}

// ==========================================
// 5. RENDERING & DOM UPDATES
// ==========================================

/**
 * Filter todos based on current filter state and search query
 */
function getFilteredTodos() {
  return todos.filter((todo) => {
    // Tab filter
    let matchesTab = true;
    if (currentFilter === "active") matchesTab = !todo.completed;
    if (currentFilter === "completed") matchesTab = todo.completed;

    // Search query filter
    let matchesSearch = true;
    if (searchQuery) {
      matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return matchesTab && matchesSearch;
  });
}

/**
 * Update metrics counters and tab badges
 */
function updateMetrics() {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;

  totalTasksCount.textContent = total;
  activeTasksCount.textContent = active;
  completedTasksCount.textContent = completed;

  badgeAll.textContent = total;
  badgeActive.textContent = active;
  badgeCompleted.textContent = completed;

  // Toggle Clear Completed button state
  if (completed > 0) {
    clearCompletedBtn.style.visibility = "visible";
  } else {
    clearCompletedBtn.style.visibility = "hidden";
  }
}

/**
 * Create DOM element for a single todo item
 * @param {Object} todo - Todo data object
 */
function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = `todo-item ${todo.completed ? "completed" : ""}`;
  li.dataset.id = todo.id;

  const isEditing = editingId === todo.id;

  if (isEditing) {
    // Edit Mode View
    li.innerHTML = `
      <div style="flex: 1; margin-right: 12px;">
        <input 
          type="text" 
          class="edit-input" 
          value="${escapeHtml(todo.text)}" 
          maxlength="120"
          id="editInput-${todo.id}"
        />
      </div>
      <div class="todo-actions">
        <button class="action-btn save-edit-btn" title="Save">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
        <button class="action-btn cancel-edit-btn" title="Cancel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `;

    // Automatically focus input when entering edit mode
    setTimeout(() => {
      const editInp = li.querySelector(`#editInput-${todo.id}`);
      if (editInp) {
        editInp.focus();
        editInp.setSelectionRange(editInp.value.length, editInp.value.length);
      }
    }, 10);

    return li;
  }

  // Normal View
  li.innerHTML = `
    <div class="todo-left">
      <label class="custom-checkbox">
        <input type="checkbox" ${todo.completed ? "checked" : ""} class="toggle-checkbox" />
        <span class="checkbox-visual">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      </label>
      <div class="task-content-block">
        <span class="task-text" title="Double click to edit">${escapeHtml(todo.text)}</span>
        <span class="task-time">Created at ${todo.createdAt || "today"}</span>
      </div>
    </div>
    <div class="todo-actions">
      <button class="action-btn edit-btn" title="Edit Task" aria-label="Edit Task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
        </svg>
      </button>
      <button class="action-btn delete-btn" title="Delete Task" aria-label="Delete Task">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          <line x1="10" y1="11" x2="10" y2="17"/>
          <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>
      </button>
    </div>
  `;

  return li;
}

/**
 * Main render function
 */
function render() {
  updateMetrics();
  const filtered = getFilteredTodos();

  todoList.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    if (searchQuery) {
      emptyTitle.textContent = "No matches found";
      emptySubtitle.textContent = `No tasks matching "${searchQuery}"`;
    } else if (currentFilter === "active") {
      emptyTitle.textContent = "All caught up!";
      emptySubtitle.textContent = "You have no pending tasks right now.";
    } else if (currentFilter === "completed") {
      emptyTitle.textContent = "No completed tasks yet";
      emptySubtitle.textContent = "Mark a task as done to see it here.";
    } else {
      emptyTitle.textContent = "Your list is empty";
      emptySubtitle.textContent = "Add a new task above to get started!";
    }
  } else {
    emptyState.classList.add("hidden");
    const fragment = document.createDocumentFragment();
    filtered.forEach((todo) => {
      fragment.appendChild(createTodoElement(todo));
    });
    todoList.appendChild(fragment);
  }
}

// ==========================================
// 6. EVENT LISTENERS & DELEGATION
// ==========================================

// Form Submission (Add Task)
todoForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent page reload
  const value = todoInput.value;
  if (addTodo(value)) {
    todoInput.value = "";
    todoInput.focus();
  }
});

// Clear input validation error on typing
todoInput.addEventListener("input", () => {
  if (!inputFeedback.classList.contains("hidden")) {
    hideInputError();
  }
});

// Filter Tabs Click
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Search Input Listener
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  render();
});

// Clear Completed Button
clearCompletedBtn.addEventListener("click", clearCompleted);

// Event Delegation on Todo List (Toggle, Delete, Edit)
todoList.addEventListener("click", (e) => {
  const item = e.target.closest(".todo-item");
  if (!item) return;
  const id = item.dataset.id;

  // Toggle completion via checkbox
  if (e.target.closest(".toggle-checkbox")) {
    toggleTodo(id);
    return;
  }

  // Delete button
  if (e.target.closest(".delete-btn")) {
    deleteTodo(id);
    return;
  }

  // Edit button
  if (e.target.closest(".edit-btn")) {
    editingId = id;
    render();
    return;
  }

  // Save edit button (in edit mode)
  if (e.target.closest(".save-edit-btn")) {
    const editInput = item.querySelector(".edit-input");
    if (editInput) {
      updateTodoText(id, editInput.value);
    }
    return;
  }

  // Cancel edit button
  if (e.target.closest(".cancel-edit-btn")) {
    editingId = null;
    render();
    return;
  }
});

// Double click on task text to enter edit mode
todoList.addEventListener("dblclick", (e) => {
  const taskText = e.target.closest(".task-text");
  if (!taskText) return;
  const item = taskText.closest(".todo-item");
  if (item) {
    editingId = item.dataset.id;
    render();
  }
});

// Handle Keydown in edit input (Enter to save, Escape to cancel)
todoList.addEventListener("keydown", (e) => {
  if (e.target.classList.contains("edit-input")) {
    const item = e.target.closest(".todo-item");
    const id = item.dataset.id;

    if (e.key === "Enter") {
      updateTodoText(id, e.target.value);
    } else if (e.key === "Escape") {
      editingId = null;
      render();
    }
  }
});

// Theme Switcher Event
themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  if (newTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  localStorage.setItem(THEME_KEY, newTheme);
});

// ==========================================
// 7. HELPER UTILITIES
// ==========================================

function showInputError(msg) {
  inputFeedback.textContent = msg;
  inputFeedback.classList.remove("hidden");
  todoInput.focus();
}

function hideInputError() {
  inputFeedback.textContent = "";
  inputFeedback.classList.add("hidden");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================
// 8. BOOTSTRAP
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  displayCurrentDate();
  loadTodos();
  render();
});
