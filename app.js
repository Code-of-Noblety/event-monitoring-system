import express from 'express';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken'; 
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

function doAuth() {
  // WIP
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve public files (CSS, images, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Homepage
app.get('/', (req, res) => {
  res.redirect('/main');
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, "private", "main.html"));
})

// Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {

});

// Register
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email
    }
    const password = req.body.password;
    
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, {httpOnly: true, secure: true});

    res.redirect('/main');
});

// Start server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
