
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));
app.use(express.json());

let rooms = {};

io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        if (!rooms[roomId]) rooms[roomId] = [];
        socket.emit('load-messages', rooms[roomId]);
    });

    socket.on('message', ({ roomId, user, text, media }) => {
        const msg = { user, text, media, time: new Date().toISOString() };
        rooms[roomId].push(msg);
        io.to(roomId).emit('message', msg);
    });
});

app.post('/upload', upload.single('media'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ url: '/uploads/' + req.file.filename });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
