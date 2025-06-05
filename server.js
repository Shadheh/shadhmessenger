
const express = require('express');
const multer = require('multer');
const http = require('http');
const path = require('path');
const qr = require('qrcode');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const users = {}; // simple in-memory user store

// Multer storage for uploads
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Login
app.get('/login', (req, res) => res.sendFile(__dirname + '/views/login.html'));
app.post('/login', (req, res) => {
  users[req.body.username] = req.body.password;
  return res.redirect('/');
});

// QR code endpoint
app.get('/qr/:text', async (req, res) => {
  const code = await qr.toDataURL(req.params.text);
  res.send(`<img src="${code}"/>`);
});

// Upload
app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ file: '/uploads/' + req.file.filename });
});

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

io.on('connection', socket => {
  socket.on('message', data => io.emit('message', data));
});

const port = process.env.PORT || 10000;
server.listen(port, () => console.log('Server running on port ' + port));
