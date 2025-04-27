// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAF5J_xcsO0BySIFboOzbhlySlka3emkao",
  authDomain: "hackathon-2bbe0.firebaseapp.com",
  projectId: "hackathon-2bbe0",
  storageBucket: "hackathon-2bbe0.appspot.com",
  messagingSenderId: "673105244060",
  appId: "1:673105244060:web:b69f9b784ee5a42b616259"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const titleInput = document.getElementById('title');
const assignedToInput = document.getElementById('assignedTo');
const descriptionInput = document.getElementById('description');
const createTaskBtn = document.getElementById('createTask');

const todoList = document.getElementById('todo-tasks');
const inProgressList = document.getElementById('inprogress-tasks');
const doneList = document.getElementById('done-tasks');

// Check Auth
onAuthStateChanged(auth, user => {
  if (user) {
    console.log('Logged in as:', user.email);
    loadTasks();
  } else {
    window.location.href = "index.html"; // Not logged in
  }
});

// Create Task
createTaskBtn.addEventListener('click', async () => {
  const title = titleInput.value.trim();
  const assignedTo = assignedToInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !assignedTo) {
    alert("Please fill Title and Assigned To fields!");
    return;
  }

  await addDoc(collection(db, "tasks"), {
    title,
    assignedTo,
    description,
    status: "To Do",
    createdAt: new Date()
  });

  titleInput.value = '';
  assignedToInput.value = '';
  descriptionInput.value = '';

  loadTasks();
});

// Load Tasks
async function loadTasks() {
  todoList.innerHTML = '';
  inProgressList.innerHTML = '';
  doneList.innerHTML = '';

  const snapshot = await getDocs(collection(db, "tasks"));
  snapshot.forEach(docSnap => {
    const task = docSnap.data();
    const taskId = docSnap.id;
    renderTask(task, taskId);
  });
}

// Render Single Task
function renderTask(task, taskId) {
  const taskCard = document.createElement('div');
  taskCard.className = 'task-card';
  taskCard.innerHTML = `
    <h3>${task.title}</h3>
    <p><strong>Assigned:</strong> ${task.assignedTo}</p>
    <p>${task.description}</p>
    <div class="task-buttons">
      ${task.status !== 'In Progress' ? `<button onclick="moveTask('${taskId}', 'In Progress')">Move to In Progress</button>` : ''}
      ${task.status !== 'Done' ? `<button onclick="moveTask('${taskId}', 'Done')">Move to Done</button>` : ''}
      <button onclick="deleteTask('${taskId}')">Delete</button>
    </div>
  `;

  if (task.status === "To Do") {
    todoList.appendChild(taskCard);
  } else if (task.status === "In Progress") {
    inProgressList.appendChild(taskCard);
  } else if (task.status === "Done") {
    doneList.appendChild(taskCard);
  }
}

// Move Task
window.moveTask = async (taskId, newStatus) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    status: newStatus
  });
  loadTasks();
}

// Delete Task
window.deleteTask = async (taskId) => {
  if (confirm("Are you sure you want to delete this task?")) {
    await deleteDoc(doc(db, "tasks", taskId));
    loadTasks();
  }
}

        // Logout Handler
        document.addEventListener('DOMContentLoaded', () => {
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', async () => {
                    try {
                        await signOut(auth);
                        console.log("User signed out successfully.");
                        window.location.href = 'index.html';
                    } catch (error) {
                        console.error('Error signing out:', error);
                    }
                });
            } else {
                console.error("Logout button not found!");
            }
        });