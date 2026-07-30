const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./models/db');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));
app.use((req, res, next) => {
    if (!req.session.cart) req.session.cart = [];
    next();
});

app.post('/cart/add/:id', (req, res) => {
    db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, product) => {
        req.session.cart.push(product);
        res.redirect('/');
    });
});

app.get('/cart', (req, res) => {
    res.render('cart', { cart: req.session.cart });
});

app.post('/checkout', (req, res) => {
    const total = req.session.cart.reduce((sum, item) => sum + item.price, 0);
    db.run("INSERT INTO orders (user_id, total) VALUES (?, ?)", [req.session.user ? req.session.user.id : null, total], () => {
        req.session.cart = [];
        res.send('Order placed successfully!');
    });
});


app.get('/', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        res.render('index', { products: rows, user: req.session.user });
    });
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (user) {
            req.session.user = user;
            res.redirect('/');
        } else {
            res.send('Invalid login');
        }
    });
});

app.get('/register', (req, res) => res.render('register'));
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], () => {
        res.redirect('/login');
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));