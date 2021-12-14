let WebSocket = require('ws').Server

let wss = new WebSocket({ port: 9000 })
wss.on('connection', (ws) => {
    console.log('服务端-客户端 连接成功');

    //用来处理接收客户端的消息
    ws.on('message', (buffer) => {
        ws.send('我是服务端，已收到信息');//发送消息给客户端
    })

    //当用户关闭网页或者手动关闭网页连接时自动触发
    ws.on('close', function () {
        console.log('服务端关闭了');
    });

    //error事件这个必须写，否则当客户端关闭时，后端服务器会崩溃
    ws.on('error', function (err) {
        console.log('关闭客户端', err);
    })
})