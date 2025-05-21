const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3001;

app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.get('/cookie/item/:id', (req, res) => {
    let history = req.cookies.history ? JSON.parse(req.cookies.history) : [];
    const entry = `Item ${req.params.id} on ${new Date().toLocaleDateString()}`;
    history.push(entry);
    if (history.length > 5) history.shift();
    res.cookie('history', JSON.stringify(history), { httpOnly: true });
    res.send(`
        <h2>Cookie: You viewed ${entry}</h2>
       <!--- <p><a href="/cookie/history">View Cookie History</a></p>
        <p><a href="/session/history">View Session History</a></p> --->
    `);
});

app.get('/cookie/history', (req, res) => {
    const history = req.cookies.history ? JSON.parse(req.cookies.history) : [];
    res.send(`
        <h3>Cookie-Based History</h3>
        <ol>${history.map(item => `<li>${item}</li>`).join('')}</ol>
        <p><a href="/session/history">View Session History</a></p>
    `);
});

app.get('/session/item/:id', (req, res) => {
    if (!req.session.history) req.session.history = [];
    const entry = `Item ${req.params.id} on ${new Date().toLocaleDateString()}`;
    req.session.history.push(entry);
    if (req.session.history.length > 5) req.session.history.shift();
    res.send(`
        <h2>Session: You viewed ${entry}</h2>
        <p><a href="/session/history">View Session History</a></p>
        <p><a href="/cookie/history">View Cookie History</a></p>
    `);
});

app.get('/session/history', (req, res) => {
    const history = req.session.history || [];
    res.send(`
        <h3>Session-Based History</h3>
        <ol>${history.map(item => `<li>${item}</li>`).join('')}</ol>
        <p><a href="/cookie/history">View Cookie History</a></p>
    `);
});

/*app.get('/', (req, res) => {
    res.send(`
        <h1>Tracking Demo</h1>
        <h2>Cookie-based tracking:</h2>
        <ul>
            <li><a href="/cookie/item/1">View Item 1 (Cookie)</a></li>
            <li><a href="/cookie/item/2">View Item 2 (Cookie)</a></li>
            <li><a href="/cookie/history">View Cookie History</a></li>
        </ul>
        <h2>Session-based tracking:</h2>
        <ul>
            <li><a href="/session/item/1">View Item 1 (Session)</a></li>
            <li><a href="/session/item/2">View Item 2 (Session)</a></li>
            <li><a href="/session/history">View Session History</a></li>
        </ul>
    `);
});*/

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
