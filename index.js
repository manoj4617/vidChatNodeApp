const { static } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');


const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const peerServer = ExpressPeerServer(server, {
    debug:true
});
app.use('/peerjs', peerServer);

//view engine
app.set('view engine','ejs');

//for static files
app.use(express.static('public'));

//routes
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
});

app.get('/:index',(req,res)=>{
    res.render('index',{roomID: req.params.index});
});

//making socket.io connection
io.on('connection', socket => {
    socket.on('join-room',(roomID, userid)=>{
        socket.join(roomID);
        socket.to(roomID).broadcast.emit('user-connected', userid);
        //receiving messages
        socket.on('message',(message)=>{
            console.log(message)
            //sending the received message to everyone in the same room
            io.to(roomID).emit('createMessage',message);
        });
        socket.on('disconnect',()=>{
            socket.to(roomID).broadcast.emit('user-disconnected',userid)
        })
    });
    
});

server.listen(4000);
// console.log(`listening to http://localhost:3030`);
