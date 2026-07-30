const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ecommerce.db');

db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
    db.run("CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, description TEXT)");
    db.run("CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total REAL)");
    
    const stmt = db.prepare("INSERT INTO products (name, price, description) VALUES (?, ?, ?)");
    stmt.run("Laptop", 999.99, "A powerful laptop for work.");
    stmt.run("Mouse", 25.50, "A wireless mouse.");
    stmt.finalize();
});

module.exports = db;