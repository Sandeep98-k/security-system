const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (creates a file named 'security.db')
const db = new sqlite3.Database('./security.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the security database.');
    }
});

// Create Incidents Table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guard_name TEXT,
        location TEXT,
        type TEXT,
        description TEXT,
        status TEXT DEFAULT 'Pending',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;