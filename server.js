const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to read JSON data from requests
app.use(express.json());

// Temporary in-memory task data
let tasks = [
    {
        id: 1,
        title: "Complete CodeOrbit Task 3",
        completed: false
    },
    {
        id: 2,
        title: "Test REST API using Postman",
        completed: false
    }
];

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "CodeOrbit REST API is running successfully!",
        endpoints: {
            getAllTasks: "GET /api/tasks",
            getSingleTask: "GET /api/tasks/:id",
            addTask: "POST /api/tasks",
            updateTask: "PUT /api/tasks/:id",
            deleteTask: "DELETE /api/tasks/:id"
        }
    });
});

// GET - Get all tasks
app.get("/api/tasks", (req, res) => {
    res.json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

// GET - Get a single task
app.get("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    res.json({
        success: true,
        data: task
    });
});

// POST - Add a new task
app.post("/api/tasks", (req, res) => {
    const { title, completed = false } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Task title is required"
        });
    }

    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title: title.trim(),
        completed: completed
    };

    tasks.push(newTask);

    res.status(201).json({
        success: true,
        message: "Task added successfully",
        data: newTask
    });
});

// PUT - Update an existing task
app.put("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const { title, completed } = req.body;

    if (title !== undefined) {
        if (title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Task title cannot be empty"
            });
        }

        task.title = title.trim();
    }

    if (completed !== undefined) {
        task.completed = completed;
    }

    res.json({
        success: true,
        message: "Task updated successfully",
        data: task
    });
});

// DELETE - Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const taskExists = tasks.some(task => task.id === id);

    if (!taskExists) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    tasks = tasks.filter(task => task.id !== id);

    res.json({
        success: true,
        message: "Task deleted successfully"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});