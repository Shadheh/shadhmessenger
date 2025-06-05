const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: '/uploads/' + req.file.filename });
});

io.on('connection', (socket) => {
  socket.on('message', (msg) => io.emit('message', msg));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log('Server running on ' + PORT));