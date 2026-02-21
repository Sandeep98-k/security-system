const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// 1. Get all incidents
app.get('/api/incidents', (req, res) => {
    const sql = "SELECT * FROM incidents ORDER BY timestamp DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// 2. Add a new incident
app.post('/api/incidents', (req, res) => {
    const { guard_name, location, type, description } = req.body;
    const sql = 'INSERT INTO incidents (guard_name, location, type, description) VALUES (?,?,?,?)';
    
    db.run(sql, [guard_name, location, type, description], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ 
            message: 'Incident reported successfully', 
            id: this.lastID 
        });
    });
});

// 3. Update incident status (Resolve)
app.patch('/api/incidents/:id', (req, res) => {
    const { status } = req.body;
    const sql = 'UPDATE incidents SET status = ? WHERE id = ?';
    
    db.run(sql, [status, req.params.id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Status updated' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});