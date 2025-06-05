
const socket = io();
let currentRoom = "";

function joinRoom() {
  currentRoom = document.getElementById("room").value;
  if (!currentRoom) return alert("Enter room ID");
  document.getElementById("chat-container").classList.remove("hidden");
  socket.emit("join-room", currentRoom);
}

socket.on("load-messages", (msgs) => {
  const chat = document.getElementById("messages");
  chat.innerHTML = '';
  msgs.forEach(m => showMessage(m));
});

function send() {
  const user = document.getElementById("username").value;
  const msg = document.getElementById("msg").value;
  const mediaInput = document.getElementById("mediaInput");
  if (!user || (!msg && !mediaInput.files[0])) return alert("Write or upload something");

  if (mediaInput.files[0]) {
    const formData = new FormData();
    formData.append("media", mediaInput.files[0]);
    fetch("/upload", {
      method: "POST",
      body: formData
    }).then(res => res.json()).then(data => {
      socket.emit("message", { roomId: currentRoom, user, text: msg, media: data.url });
    });
  } else {
    socket.emit("message", { roomId: currentRoom, user, text: msg });
  }
}

socket.on("message", showMessage);

function showMessage({ user, text, media, time }) {
  const div = document.createElement("div");
  div.innerHTML = "<b>" + user + "</b>: " + text + 
    (media ? `<br><img src="${media}" style='max-width:100px;'>` : "") +
    `<div style='font-size:10px;color:#999;'>${new Date(time).toLocaleTimeString()}</div>`;
  document.getElementById("messages").appendChild(div);
}
