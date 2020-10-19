const { static } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server)

app.set('view engine','ejs');

app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
});

app.get('/:index',(req,res)=>{
    res.render('index',{roomID: req.params.index});
});

server.listen(4000);
// console.log(`listening to http://localhost:3030`);