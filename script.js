const socket = io();
let currentRoom = "";
let username = "";

function joinChat() {
  username = document.getElementById("username-input").value.trim();
  if (!username) return alert("Enter username");
  document.getElementById("auth-screen").classList.add("hidden");
  document.getElementById("chat-screen").classList.remove("hidden");
  socket.emit("getRooms");
}

function createRoom() {
  const room = document.getElementById("new-room-name").value.trim();
  if (room) {
    socket.emit("createRoom", room);
    setTimeout(() => joinRoom(room), 100); // ⏱ wait 100ms to ensure room list updates
  }
}

function joinRoom(room) {
  currentRoom = room;
  document.getElementById("room-name").textContent = room;
  document.getElementById("messages").innerHTML = "";
  socket.emit("joinRoom", { username, room });
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const msg = input.value.trim();
  if (msg) {
    socket.emit("message", { room: currentRoom, username, message: msg });
    input.value = "";
  }
}

socket.on("roomList", (rooms) => {
  const list = document.getElementById("room-list");
  list.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.textContent = room;
    li.onclick = () => joinRoom(room);
    list.appendChild(li);
  });
});

socket.on("message", (data) => {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<span>${data.username}</span>: ${
    data.message
  } <small>${new Date().toLocaleTimeString()}</small>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});
