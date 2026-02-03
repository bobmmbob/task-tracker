// API Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('token');
let currentUser = null;
let allTasks = [];
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        checkAuth();
    } else {
        showAuthSection();
    }
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('task-form').addEventListener('submit', handleAddTask);
}

// Auth Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data;
            localStorage.setItem('token', authToken);
            showAppSection();
            loadTasks();
        } else {
            showError(errorDiv, data.message || 'Login failed');
        }
    } catch (error) {
        showError(errorDiv, 'Network error. Please check if backend is running.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data;
            localStorage.setItem('token', authToken);
            showAppSection();
            loadTasks();
        } else {
            showError(errorDiv, data.message || 'Registration failed');
        }
    } catch (error) {
        showError(errorDiv, 'Network error. Please check if backend is running.');
    }
}

async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            currentUser = await response.json();
            showAppSection();
            loadTasks();
        } else {
            logout();
        }
    } catch (error) {
        logout();
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('token');
    showAuthSection();
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
}

// Task Functions
async function loadTasks() {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '<div class="loading">Loading tasks...</div>';

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            allTasks = await response.json();
            renderTasks();
        } else {
            container.innerHTML = '<div class="empty-state"><h3>Failed to load tasks</h3></div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="empty-state"><h3>Network error</h3><p>Please check if backend is running</p></div>';
    }
}

async function handleAddTask(e) {
    e.preventDefault();

    const task = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        priority: document.getElementById('task-priority').value,
        status: document.getElementById('task-status').value,
        dueDate: document.getElementById('task-due-date').value || undefined
    };

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(task)
        });

        if (response.ok) {
            document.getElementById('task-form').reset();
            loadTasks();
        } else {
            const data = await response.json();
            alert('Failed to add task: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        alert('Network error. Please check if backend is running.');
    }
}

async function updateTask(taskId, updates) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            loadTasks();
        } else {
            alert('Failed to update task');
        }
    } catch (error) {
        alert('Network error');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            loadTasks();
        } else {
            alert('Failed to delete task');
        }
    } catch (error) {
        alert('Network error');
    }
}

// Render Functions
function renderTasks() {
    const container = document.getElementById('tasks-container');
    let filteredTasks = allTasks;

    if (currentFilter !== 'all') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>${currentFilter === 'all' ? 'Start by adding a new task above!' : `No ${currentFilter} tasks`}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => `
        <div class="task-card priority-${task.priority}">
            <div class="task-header">
                <div>
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    <div class="task-meta">
                        <span class="badge badge-priority-${task.priority}">${task.priority}</span>
                        <span class="badge badge-status-${task.status}">${formatStatus(task.status)}</span>
                    </div>
                </div>
            </div>
            <div class="task-description">${escapeHtml(task.description)}</div>
            ${task.dueDate ? `<div class="task-due-date">📅 Due: ${formatDate(task.dueDate)}</div>` : ''}
            <div class="task-actions">
                ${task.status !== 'completed' ? 
                    `<button class="btn btn-success" onclick="updateTask('${task._id}', { status: '${getNextStatus(task.status)}' })">
                        Mark as ${formatStatus(getNextStatus(task.status))}
                    </button>` : ''}
                <button class="btn btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function filterTasks(filter) {
    currentFilter = filter;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTasks();
}

// UI Helper Functions
function showAuthSection() {
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('app-section').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
}

function showAppSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-name').textContent = currentUser.name || currentUser.email;
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('register-tab').classList.add('active');
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatStatus(status) {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getNextStatus(currentStatus) {
    const statusMap = {
        'todo': 'in-progress',
        'in-progress': 'completed',
        'completed': 'completed'
    };
    return statusMap[currentStatus] || 'in-progress';
}
