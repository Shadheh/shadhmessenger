const socket = io();
const msgBox = document.getElementById('message');
const messages = document.getElementById('messages');

socket.on('message', msg => {
  const div = document.createElement('div');
  div.textContent = msg;
  messages.appendChild(div);
});

function sendMessage() {
  const msg = msgBox.value;
  socket.emit('message', msg);
  msgBox.value = '';
}

document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/upload', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  socket.emit('message', `Shared file: ${data.file}`);
});