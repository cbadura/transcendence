const socket = io('http://127.0.0.1:3000');
const mouseXElement = document.getElementById('mouseX');
const mouseYElement = document.getElementById('mouseY');
const serverResponseElement = document.getElementById('serverResponse');

socket.on('connect', () => {
   console.log('WebSocket connection established.');
});


document.addEventListener('mousemove', (event) => {
  const { clientX, clientY } = event;
  // Display current cursor coordinates
  mouseXElement.textContent = clientX;
  mouseYElement.textContent = clientY;

  // Send cursor coordinates to the server
  socket.emit('cursorCoordinates', { x: clientX, y: clientY });
});

socket.on('message', (message) => {
  // Display server response
  serverResponseElement.textContent = message;
});

