
const PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
// 加入線上人數計數
let onlineCount = 0;

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/views/index.html');
});
 
// 當發生連線事件
io.on('connection', (socket) => {
    console.log('Hello!');  // 顯示 Hello!
	// 有連線發生時增加人數
	onlineCount++;
	// 發送人數給網頁
    io.emit("online", onlineCount);
	
	socket.on("send", (msg) => {
        io.emit("msg", msg);
    });

	// 接收來自前端的 greet 事件
    // 然後回送 greet 事件，並附帶內容
	socket.on("greet", () => {
        socket.emit("greet", onlineCount);
    });
	
    // 當發生離線事件
    socket.on('disconnect', () => {
        // 有人離線了，扣人
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
});


// 注意，這邊的 server 原本是 app
server.listen(PORT, () => {
    console.log("Server Started. http://localhost:8080");
});
 
