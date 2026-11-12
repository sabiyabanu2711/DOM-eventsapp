# TaskMaster — Week 2: DOM & Events To-Do Application

A modern, responsive, and production-ready To-Do application built using pure **Vanilla JavaScript (DOM & Events)**, **HTML5**, and modern **CSS3**.

---

## 🎯 Compulsory Hand-in Statement
> **What must be handed in:**  
> *"A fully functional and responsive web to-do application built with vanilla JavaScript DOM manipulation and event listeners that supports adding, deleting, filtering (All, Active, Completed), and persisting tasks across page reloads using `localStorage`."*

---

## ✨ Features Implemented

1. **Add Tasks (`addTodo`)**:
   - Built with HTML form submission (`submit` event) & Enter key support.
   - Trims whitespace and prevents empty or duplicate tasks with friendly inline validation.
   - Automatically timestamps each task upon creation.

2. **Delete Tasks (`deleteTodo`)**:
   - Instant task deletion with trash icon.
   - Batch deletion of completed items via the **"Clear Finished"** button.

3. **Toggle Completion (`toggleTodo`)**:
   - Custom styled accessible checkbox.
   - Instant visual feedback (strikethrough and opacity transition).

4. **Filter Tasks (`filterTodos`)**:
   - Tab-based filtering: **All**, **Active (Pending)**, and **Completed**.
   - Real-time live task count badges on each filter tab.
   - Real-time search query box to search tasks instantly by keyword.

5. **LocalStorage Persistence**:
   - All tasks, completion statuses, and timestamps are persisted in `localStorage`.
   - Reloading or closing the browser retains all tasks seamlessly.
   - Includes fallback sample tasks for initial first-time load.

6. **Bonus / Professional UI Touches**:
   - **Inline Edit**: Double-click any task title or click the edit icon to edit in-place (Press `Enter` to save, `Esc` to cancel).
   - **Light / Dark Mode**: Theme switcher button with preference saved to `localStorage`.
   - **Metrics Bar**: Real-time counter cards showing Total, Active, and Done items.
   - **Responsive & Accessible**: Works across mobile phones, tablets, and desktop displays.

---

## 📂 Project Structure

```
DOM & events app/
├── index.html       # Semantic HTML5 layout & components
├── style.css        # Modern design, CSS variables & dark mode
├── app.js           # Clean modular DOM & event-driven JavaScript
└── README.md        # Documentation and assignment overview
```

---

## 🚀 How to Run Locally

1. **Directly in Browser**:
   - Double click `index.html` in your file explorer, or right-click and choose **"Open with Chrome / Edge / Firefox"**.

2. **Using VS Code Live Server**:
   - Open this folder in VS Code.
   - Right-click `index.html` and click **"Open with Live Server"**.

---

## 🌐 Submission Link Options (Deployment)

To submit a live URL as required:
1. **GitHub Pages (Free)**:
   - Push this folder to a GitHub repository (e.g., `todo-dom-app`).
   - Go to **Settings > Pages > Deploy from a branch (`main` / root)**.
   - You will get a live link like `https://<username>.github.io/<repo-name>/`.
2. **Netlify Drop (Takes 30 seconds)**:
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop this folder (`DOM & events app`).
   - Copy the generated live link to submit!
