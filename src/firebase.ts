// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import type { Todo } from "./interfaces/todo";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXY2WjdLn2nUGpYRJ-bNe4Fg9mhJM3cd4",
  authDomain: "to-do-list-ef51b.firebaseapp.com",
  projectId: "to-do-list-ef51b",
  storageBucket: "to-do-list-ef51b.firebasestorage.app",
  messagingSenderId: "475172481781",
  appId: "1:475172481781:web:48d9768110d913f85b33bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const tableName = 'todos'; // Define the table name for todos

const rtdb = getDatabase(app);

export async function createTodo(todo: Todo): Promise<void> {
    const newTodoRef = push(ref(rtdb, tableName));
    await set(newTodoRef, {
        text: todo.text,
        completed: todo.completed
    });
}

export async function getTodos(): Promise<Todo[]> {
    const snapshot = await get(ref(rtdb, tableName));
    const todos: Todo[] = [];
    if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
            const todoData = childSnapshot.val();
            todos.push({
                id: childSnapshot.key,
                text: todoData.text,
                completed: todoData.completed
            });
        });
    }
    return todos;
}

export async function updateTodo(todo: Todo): Promise<void> {
    await update(ref(rtdb, `${tableName}/${todo.id}`), { completed: todo.completed });
}

export async function deleteTodo(todoId: string): Promise<void> {
    await remove(ref(rtdb, `${tableName}/${todoId}`));
}