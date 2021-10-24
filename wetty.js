#!/usr/bin/env node

var express = require('express');
var http = require('http');
var path = require('path');
var server = require('socket.io');
var pty = require('pty.js');
var fs = require('fs');

var opts = require('optimist')
  .options({
    port: {
      demand: false,
      alias: 'p',
      default: 3000,
      description: 'wetty listen port'
    },
    cmd: {
      demand: true,
      alias: 'c',
      description: 'the command to run'
    }
  }).boolean('allow_discovery').argv;

process.on('uncaughtException', function(e) {
  console.error('Error: ' + e);
});

var app = express();
app.use('/', express.static(path.join(__dirname, 'public')));

var httpserv = http.createServer(app).listen(opts.port, function() {
  console.log('http on port ' + opts.port);
});

var io = server(httpserv, {path: '/wetty/socket.io'});
io.on('connection', function(socket){
  var term;
  term = pty.spawn('/bin/bash', ["-c", `${opts.cmd}; sleep 0.5; echo "<END>"`], {
    name: 'xterm-256color'
  });

  console.log((new Date()) + " PID=" + term.pid + " STARTED");
  term.on('data', function(data) {
    socket.emit('output', data);
  });
  term.on('exit', function(code) {
    console.log((new Date()) + " PID=" + term.pid + " ENDED")
  });
  socket.on('resize', function(data) {
    term.resize(data.col, data.row);
  });
  socket.on('input', function(data) {
    term.write(data);
  });
  socket.on('disconnect', function() {
    term.end();
  });
});
