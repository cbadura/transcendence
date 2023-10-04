// Connect to the Socket.IO server
const socket = io('http://10.12.3.2:3000');

// Function to send a message to the server
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;

  // Send the message to the server
  socket.emit('newMessage', message);

  // Clear the input field
  messageInput.value = '';
}

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    sendMessage(); // Send the message when 'Enter' key is pressed
  }
}

// Function to display received messages
function displayMessage(message) {
  const messageContainer = document.getElementById('messageContainer');
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageContainer.insertBefore(messageElement, messageContainer.firstChild);
}

// Listen for incoming messages from the server
socket.on('chatMessage', (message) => {
  displayMessage(message);
});

// Add event listener for the "Send" button
const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', sendMessage);

const messageInput = document.getElementById('messageInput');
messageInput.addEventListener('keydown', handleKeyDown);
