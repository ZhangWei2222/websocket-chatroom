const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3100;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    console.log('服务器拿到客户端的信息', msg)
    io.emit('chat message', '说：' + msg);
    socket.broadcast.emit('hi');
  });
  socket.on('disconnect', () => {
    console.log('disconnect')
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
