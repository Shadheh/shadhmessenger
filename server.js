
const express = require('express');
const multer = require('multer');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: 'demo',  // <-- replace with yours
  api_key: '123456',   // <-- replace with yours
  api_secret: 'abcxyz' // <-- replace with yours
});

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  fs.unlinkSync(req.file.path);
  res.send({ url: result.secure_url });
});

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

io.on('connection', socket => {
  socket.on('join', room => socket.join(room));
  socket.on('message', ({ room, msg }) => {
    io.to(room).emit('message', { msg });
  });
});

const port = process.env.PORT || 10000;
server.listen(port, () => console.log('🚀 Phase 12 running on ' + port));
