import express from 'express';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken'; 
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import {registerUser, fetchUser, fetchAuthorizedEvent, createEvent} from './database.js';
import bcrypt from 'bcrypt';

function frontendPath(dir) {
    if (!dir) return path.join(__dirname, '..', 'frontend')
    return path.join(__dirname, '..', 'frontend', dir) 
}

function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return next();
    try {
        req.userToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch(err) {
        console.log("Invalid token detected: " + err);
        res.clearCookie('token')
        return next();
    }
    return next()
}

function userAuth(req, res, next) {
    if (!req.userToken) return res.redirect('/login');
    return next();
}

function authGuard(req, res, next) {
    if (req.userToken) return res.redirect('/main');
    return next();
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve public files (CSS, images, JavaScript)
app.use(express.static(frontendPath()));

// Homepage
app.get('/', (req, res) => {
  res.redirect('/main');
});

app.get('/main', auth, userAuth, (req, res) => {
  res.sendFile(frontendPath("main.html"));
})

// Login
app.get('/login', auth, authGuard, (req, res) => {
    res.sendFile(frontendPath('login.html'));
});

app.post('/login', auth, authGuard, async (req, res) => {
    const fetchedUser = await fetchUser(req.body["username-email"])
    if (!fetchedUser) return res.status(400).send({message: "Incorrect username/email or password"});

    const isMatch = await bcrypt.compare(req.body.password, fetchedUser.password) 
    if (!isMatch) return res.status(400).send({message: "Incorrect username/email or password"});

    const token = jwt.sign({uid: fetchedUser.user_id, role: fetchedUser.role}, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        // httpOnly: true, 
        // secure: true, 
    });

    res.redirect('/main');
});

// Register
app.get('/register', auth, authGuard, (req, res) => {
    res.sendFile(frontendPath('register.html'));
});

app.post('/register', auth, authGuard, async (req, res) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10)
    }
    
    const insertToDb = await registerUser(user);
    if (!insertToDb) return res.status(400).send({message: "Username or email already exists."}); // name or email already exists
    const fetchedUser = fetchUser(username); 
    
    const token = jwt.sign({uid: fetchedUser.user_id, role: fetchedUser.role}, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
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

// events
app.get('/events/:eventId{/*abc}', auth, userAuth, async (req, res, next) => {
    const userId = req.userToken.uid;
    const eventId = req.params.eventId;

    req.eventData = await fetchAuthorizedEvent(userId, eventId);
    next()
})

app.get('/events/:eventId', (req, res, next) => {
    if (!req.eventData) return next();
    res.sendFile(frontendPath('event.html'));
})

app.get('/events/:eventId/event-data', (req, res, next) => {
    if (!req.eventData) return res.status(404).send({message: "event data not found"});
    res.status(200).send({eventData: req.eventData})
})

app.post('/create-event', auth, (req, res) => {
    if (!req.userToken) {
        return res.status(400).send({message: "Unknown user. Please relogin."})
    }
    if (req.userToken.role !== 'admin') {
        return res.status(400).send({message: "Please request for admin role to create events"})
    }

    // create event
    const event = {
        admin_id: req.userToken.uid,
        name: req.body.name,
        description: req.body.description,
        start_date: req.body['start-date'],
        end_date: req.body['end-date']
    }
    // no validation yet

    const insertToDb = createEvent(event)
    if (!insertToDb) return res.status(400).send({message: "Failed to create the event"})

    res.status(200).send({message: "Event successfully created"})
})

// default to 404 page if the resource is not found
app.get('/*abc', (req, res) => {
    res.status(404).sendFile(frontendPath('404.html'));
})

// Start server
const port = process.env.PORT || 3000
app.listen(port, '0.0.0.0', () => {
    console.log(`App listening at http://localhost:${port}`);
});
