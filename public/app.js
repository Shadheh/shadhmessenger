const socket = io();
let username = '';
let room = '';

function joinRoom() {
  username = document.getElementById('username').value || 'Guest';
  room = document.getElementById('room').value || 'default';
  socket.emit('joinRoom', room, username);
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('chat-container').style.display = 'block';
  generateQR(room);
  notify('Joined ' + room);
}

function sendMessage() {
  const msg = document.getElementById('message').value;
  socket.emit('message', msg);
  document.getElementById('message').value = '';
}

socket.on('message', msg => {
  const div = document.createElement('div');
  div.textContent = msg;
  document.getElementById('messages').appendChild(div);
  notify(msg);
});

document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/upload', { method: 'POST', body: formData });
  const data = await res.json();
  socket.emit('message', `${username} shared file: ${data.file}`);
});

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

function generateQR(roomName) {
  const canvas = document.getElementById('qrcode');
  QRCode.toCanvas(canvas, window.location.origin + "?room=" + encodeURIComponent(roomName));
}