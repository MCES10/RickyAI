const socket = io();

socket.on('message', (data) => {
  console.log(`Server: ${data}`);
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
