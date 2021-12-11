// let express = require('express')
// let app = express()
let WebSocket = require('ws').Server

let wss = new WebSocket({ port: 4000 })
wss.on('connection', (ws) => {
    console.log('服务端-客户端 连接成功');

    //用来处理接收客户端的消息
    ws.on('message', (buffer) => {
        const data = JSON.parse(buffer.toString())
        switch (data.type) {
            case 'setName':
                ws.nickname = data.text;
                broadcast(JSON.stringify({
                    name: 'Server',
                    text: data.text + '加入了房间'
                }));
                break;
            case 'chat':
                broadcast(JSON.stringify({
                    name: ws.nickname,
                    text: data.text
                }));
                break;
            default:
                break;
        }
    })

    //当用户关闭网页或者手动关闭网页连接时自动触发
    ws.on('close', function () {
        broadcast(JSON.stringify({
            name: 'Server',
            text: ws.nickname + '离开了房间'
        }));
    });

    //error事件这个必须写，否则当客户端关闭时，后端服务器会崩溃
    ws.on('error', function (err) {
        console.log('关闭客户端', err);
    })

    //循环将消息广播更新给所有人
    function broadcast(value) {
        console.log('进入广播...', value);
        // wss.clients就是可以拿到所有人数组
        // 遍历每一个人发消息
        wss.clients.forEach(function (ws) {
            ws.send(value);//发送消息给客户端
        })
    }
})