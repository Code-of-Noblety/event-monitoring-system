import express from 'express';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

function doAuth() {
  // WIP
}

app.use(express.static('public'))

app.get('/', (req, res) => {
  // intercept if authenticated
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, "private", "main.html"));
});


app.get('/login', (req, res) => {
  res.sendFile("login.html")
});

app.get('/register', (req, res) => {
  res.sendFile("register.html")
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});