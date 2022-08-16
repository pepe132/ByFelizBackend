const Server = require('./models/server');
require('dotenv').config();

const http =require('http');

setInterval(function() {
    http.get("http://byfeliz.herokuapp.com");
}, 300000); // every 5 minutes (300000)

const server=new Server();

server.listen();