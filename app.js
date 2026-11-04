import express from 'express';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile("index.html")
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, "private", "dashboard.html"));
})

app.get('/login', (req, res) => {
  res.sendFile("login.html")
});

app.get('/register', (req, res) => {
  res.sendFile("register.html")
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});