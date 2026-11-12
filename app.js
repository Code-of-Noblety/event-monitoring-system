import express from 'express';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken'; 
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import {registerUser, fetchOnLogin} from './database.js';
import bcrypt from 'bcrypt';

function doAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch(err) {
        console.log("Invalid token detected: " + err);
        return res.redirect('/login');
    }

    return next();
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve public files (CSS, images, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Homepage
app.get('/', (req, res) => {
  res.redirect('/main');
});

app.get('/main', doAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "private", "main.html"));
})

// Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const fetchedUser = await fetchOnLogin(req.body["username-email"])
    if (!fetchedUser) return res.status(400).send({message: "Incorrect username/email or password"});

    const isMatch = await bcrypt.compare(req.body.password, fetchedUser.password) 
    if (!isMatch) return res.status(400).send({message: "Incorrect username/email or password"});

    const token = jwt.sign({username: fetchedUser.username, email: fetchedUser.email}, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true, 
        secure: true, 
    });

    res.redirect('/main');
});

// Register
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', async (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10)
    }
    
    const insertToDb = await registerUser(user);
    if (insertToDb.affectedRows === 0) return res.status(400).send({message: "Username or email already exists."}); // name or email already exists
    
    const token = jwt.sign({username: user.username, email: user.email}, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true, 
        secure: true, 
    });

    res.redirect('/main');
});

// log out
app.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect('/login');
})

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
