
const express = require('express');
const multer = require('multer');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Upload setup
const mediaStorage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const profileStorage = multer.diskStorage({
  destination: './public/profile/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: mediaStorage });
const profileUpload = multer({ storage: profileStorage });

// Upload routes
app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ file: '/uploads/' + req.file.filename });
});
app.post('/profile', profileUpload.single('profile'), (req, res) => {
  res.send({ file: '/profile/' + req.file.filename });
});

// Simple homepage
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Group chat
io.on('connection', socket => {
  socket.on('message', msg => io.emit('message', msg));
});

const port = process.env.PORT || 10000;
server.listen(port, () => console.log('🚀 Server ready on port ' + port));
