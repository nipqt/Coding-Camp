let clicked = false;
const section = document.getElementById("filter-section");
let filterButton = document.getElementById("filter");
let fromCompleted = false;
let fromDeadline = false;
let TodoTask = [];
let todoList = document.getElementById("todo-list");
let deleteAllButton = document.getElementById("deleteAll");

// Buat button COMPLETED
const completedButton = document.createElement("button");
completedButton.type = "button";
completedButton.textContent = "COMPLETED";
completedButton.className = "bg-green-100 rounded-[4px] p-2 font-bold text-[12px]";
completedButton.id = "completed-button";

// Buat button DEADLINE
const deadlineButton = document.createElement("button");
deadlineButton.type = "button";
deadlineButton.textContent = "DEADLINE";
deadlineButton.className = "bg-red-100 rounded-[4px] p-2 font-bold text-[12px]";
deadlineButton.id = "deadline-button";

// Buat button ALL
const allButton = document.createElement("button");
allButton.type = "button";
allButton.textContent = "ALL";
allButton.className = "bg-blue-200 rounded-[4px] p-2 font-bold text-[12px]";
allButton.id = "all-button";

// Pasang event click ke filterButton
section.addEventListener("click", function (e) {
    if (!clicked && e.target.id === "filter") {
        // Ganti jadi X
        filterButton.textContent = "X";
        
        completedButton.disabled = false; // Enable the completed button
        deadlineButton.disabled = false; // Enable the deadline button
        
        // Tambah ke section
        section.appendChild(completedButton);
        section.appendChild(deadlineButton);
        section.appendChild(allButton);

        clicked = true;
    } else if (clicked && e.target.id === "filter") {
        resetFilter();
        if (fromCompleted) {
            completedButton.disabled = true;
            section.appendChild(completedButton);
        } else if (fromDeadline) { 
            deadlineButton.disabled = true;
            section.appendChild(deadlineButton);
        }
    } else if (e.target.id === "completed-button") {
        fromCompleted = true; // Set flag to indicate we are showing completed tasks
        fromDeadline = false; // Reset flag to indicate we are showing all tasks
        resetFilter();
        completedButton.disabled = true; // Disable the completed button to prevent multiple clicks
        section.appendChild(completedButton);
        showCompletedTasks();
    } else if (e.target.id === "all-button") {
        fromCompleted = false; // Reset flag to indicate we are showing all tasks
        fromDeadline = false; // Reset flag to indicate we are showing all tasks
        resetFilter();
        displayTodos(); // Tampilkan semua todo
    } else if (e.target.id === "deadline-button") {
        fromCompleted = false; // Reset flag to indicate we are showing all tasks
        fromDeadline = true; // Set flag to indicate we are showing deadline tasks
        resetFilter();
        deadlineButton.disabled = true; // Disable the completed button to prevent multiple clicks
        section.appendChild(deadlineButton);
        showDeadlineTasks(); // Tampilkan semua todo dengan status DEADLINE
    }
});

// Fungsi untuk mereset filter
function resetFilter() {
    // Reset filter button to original state
    filterButton.textContent = "FILTER";
    clicked = false;

    // Remove any additional buttons
    const completedBtn = document.getElementById("completed-button");
    const allBtn = document.getElementById("all-button");
    const deadlineBtn = document.getElementById("deadline-button");
    if (completedBtn) section.removeChild(completedBtn);
    if (allBtn) section.removeChild(allBtn);
    if (deadlineBtn) section.removeChild(deadlineBtn);
}

// Pasang event listener untuk form submit
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah form dari submit default
    const todoId = Date.now(); // ID unik untuk setiap todo
    const todoName = document.getElementById("todo-name").value;
    const todoDate = document.getElementById("todo-date").value;
    if (todoName && todoDate) {
        if (todoDate < new Date().toISOString().split('T')[0]) {
            alert("Due date cannot be in the past.");
        } else if (todoDate === new Date().toISOString().split('T')[0]){
            const todoStatus = "DEADLINE"; // Status awal todo
            TodoTask.push({ id:todoId, name: todoName, date: todoDate, status: todoStatus });
            displayTodos(); // Tampilkan daftar todo
            document.getElementById("todo-name").value = "";
            document.getElementById("todo-date").value = "";
        } else {
            const todoStatus = "PENDING"; // Status awal todo
            TodoTask.push({ id:todoId, name: todoName, date: todoDate, status: todoStatus });
            displayTodos(); // Tampilkan daftar todo
            resetFilter();
            document.getElementById("todo-name").value = "";
            document.getElementById("todo-date").value = "";
        }
    } else {
        alert("Please fill in both fields.");
    }
});

// Fungsi untuk menampilkan daftar todo
function displayTodos() {
    todoList.innerHTML = ""; // Kosongkan daftar todo
    if (TodoTask.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td class="p-2 text-center text-slate-300" colspan="4">No task found</td>`;
        todoList.appendChild(emptyRow);
    }
    TodoTask.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort tasks by date
    TodoTask.forEach((task) => {
        if (task.status === "PENDING") {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-1 px-2">${task.name}</td>
                <td class="p-1 px-2">${task.date}</td>
                <td class="p-1 px-2">
                    <section class="flex items-center gap-1 px-1">
                        <div class="p-2 w-1 h-1 bg-blue-200 rounded-full"></div>
                        <span class="text-blue-200 font-bold text-[px]">${task.status}</span>
                    </section>
                </td>
                <td class="flex flex-col gap-2 p-2">
                    <button type="button" class="bg-green-500 rounded-[4px] p-2 text-white font-bold text-[12px]" onclick="completedTodo(${task.id})">COMPLETE</button>
                    <button type="button" class="bg-red-500 rounded-[4px] p-2 text-white font-bold text-[12px]" onclick="deleteTodo(${task.id})">DELETE</button>
                </td>
            `;
            todoList.appendChild(row);
        } else if (task.status === "COMPLETED") {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-1 px-2">${task.name}</td>
                <td class="p-1 px-2">${task.date}</td>
                <td class="p-1 px-2">
                    <section class="flex items-center gap-1 px-1">
                        <div class="p-2 w-1 h-1 bg-green-200 rounded-full"></div>
                        <span class="text-green-200 font-bold text-[px]">${task.status}</span>
                    </section>
                </td>
                <td class="flex flex-col p-2">
                    <button type="button" class="bg-red-500 rounded-[4px] p-2 text-white font-bold text-[12px]" onclick="deleteTodo(${task.id})">DELETE</button>
                </td>
            `;
            todoList.appendChild(row);
        } else if (task.status === "DEADLINE") {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-1 px-2">${task.name}</td>
                <td class="p-1 px-2">${task.date}</td>
                <td class="p-1 px-2">
                    <section class="flex items-center gap-1 px-1">
                        <div class="p-2 w-1 h-1 bg-red-200 rounded-full"></div>
                        <span class="text-red-200 font-bold text-[px]">${task.status}</span>
                    </section>
                </td>
                <td class="flex flex-col gap-2 p-2">
                    <button type="button" class="bg-green-500 rounded-[4px] p-2 text-white font-bold text-[12px]" onclick="completedTodo(${task.id})">COMPLETE</button>
                    <button type="button" class="bg-red-500 rounded-[4px] p-2 text-white font-bold text-[12px]" onclick="deleteTodo(${task.id})">DELETE</button>
                </td>
            `;
            todoList.appendChild(row);
        }
    });
}

// Fungsi untuk menghapus semua todo
deleteAllButton.addEventListener("click", deleteAllTodos);
function deleteAllTodos() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        TodoTask = []; // Kosongkan array TodoTask
        displayTodos(); // Refresh the displayed task list
    }
}

// Fungsi untuk menghapus todo
function deleteTodo(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        const taskIndex = TodoTask.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            // Remove the task from the tasks array
            TodoTask.splice(taskIndex, 1);
            if (fromCompleted) {
                showCompletedTasks();
            } else if (fromDeadline) {
                showDeadlineTasks();
            } else {
                displayTodos(); // Refresh the displayed task list
            }  
        }
    }
}

// Fungsi untuk menandai todo sebagai selesai
function completedTodo(taskId) {
    const taskIndex = TodoTask.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        // Update the status of the task
        TodoTask[taskIndex].status = "COMPLETED";
        if (fromDeadline) {
            showDeadlineTasks();
        } else {
            displayTodos(); // Refresh the displayed task list
        }
    }
}

// Fungsi untuk menampilkan todo yang sudah selesai
function showCompletedTasks() {
    fromCompleted = true; // Set flag to indicate we are showing completed tasks
    completedCount = 0; // Reset completed count
    todoList.innerHTML = ""; // Kosongkan daftar todo
    TodoTask.forEach((task) => {
        if (task.status === "COMPLETED") {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="p-1 px-2">${task.name}</td>
            <td class="p-1 px-2">${task.date}</td>
            <td class="p-1 px-2">
            <section class="flex items-center gap-1 px-1">
            <div class="p-2 w-1 h-1 bg-green-200 rounded-full"></div>
            <span class="text-green-200 font-bold text-[px]">${task.status}</span>
            </section>
            </td>
            <td class="flex flex-col p-2">
            <button type="button" class="bg-red-500 rounded-[4px] p-2 text-white font-bold text-[12px]" onclick="deleteTodo(${task.id})">DELETE</button>
            </td>
            `;
            todoList.appendChild(row);
            completedCount++;
        }
    });
    if (completedCount === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td class="p-2 text-center text-slate-300" colspan="4">No task found</td>`;
        todoList.appendChild(emptyRow);
    }
};

// Fungsi untuk menampilkan todo yang sudah selesai
function showDeadlineTasks() {
    fromDeadline = true; // Set flag to indicate we are showing completed tasks
    deadlineCount = 0; // Reset completed count
    todoList.innerHTML = ""; // Kosongkan daftar todo
    TodoTask.forEach((task) => {
        if (task.status === "DEADLINE") {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-1 px-2">${task.name}</td>
                <td class="p-1 px-2">${task.date}</td>
                <td class="p-1 px-2">
                    <section class="flex items-center gap-1 px-1">
                        <div class="p-2 w-1 h-1 bg-red-200 rounded-full"></div>
                        <span class="text-red-200 font-bold text-[px]">${task.status}</span>
                    </section>
                </td>
                <td class="flex flex-col gap-2 p-2">
                    <button type="button" class="bg-green-500 rounded-[4px] p-2 text-white font-bold text-[12px]" onclick="completedTodo(${task.id})">COMPLETE</button>
                    <button type="button" class="bg-red-500 rounded-[4px] p-2 text-white font-bold text-[12px]" onclick="deleteTodo(${task.id})">DELETE</button>
                </td>
            `;
            todoList.appendChild(row);
            deadlineCount++;
        }
    });
    if (deadlineCount === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td class="p-2 text-center text-slate-300" colspan="4">No task found</td>`;
        todoList.appendChild(emptyRow);
    }
};