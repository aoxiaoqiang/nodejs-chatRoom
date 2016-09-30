var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// 静态资源目录
app.use('/static', express.static('public'));



/*
type 	0		连接
		1		普通消息
		3		离开
*/
var userNum = 0;
// Connect 
io.on('connection', function(socket) {
    userNum++;
    io.emit('chat', {
        type: 0,
        date: getTime(new Date()),
        content: userNum
    });
    console.log(userNum);

    socket.on('chat', function(msg) {
        io.emit('chat', {
            type: 1,
            date: getTime(new Date()),
            content: {
                msgId: socket.id,
                text: msg
            }
        });
        console.log('message: ' + msg);
    }).on('disconnect', function() {
        userNum--;
        io.emit('chat', {
            type: 0,
            date: getTime(new Date()),
            content: userNum
        });
        io.emit('chat', {
            type: 3,
            date: getTime(new Date()),
            content: 'user ' + socket.id + ' leve the chat'
        });
    });
});

function getTime(time) {
    var h = time.getHours(),
        m = time.getMinutes(),
        s = time.getSeconds();
    return h + ':' + m + ':' + s;
}

// Listen
http.listen(3000, function() {
    console.log('listening on *:3000');
});
