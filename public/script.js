
const socket = io();
function send() {
    const msg = document.getElementById('msg').value;
    socket.emit('message', msg);
    const div = document.createElement('div');
    div.textContent = "You: " + msg;
    document.getElementById('chat').appendChild(div);
}
socket.on('message', (msg) => {
    const div = document.createElement('div');
    div.textContent = "Friend: " + msg;
    document.getElementById('chat').appendChild(div);
});
