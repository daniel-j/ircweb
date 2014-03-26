#!/usr/bin/env node
'use strict';

var port = 8012;

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {'log level': 2});
var irc = require('irc');
var fs = require('fs');

app.use("/", express.static(__dirname+'/static/'));
server.listen(port);

var config = {
	server: 'irc.bsnet.se',
	port: 6667
};

var validIrcNick = /^[a-z\_\-\[\]\\\^\{\}\|\`][a-z0-9\_\-\[\]\\\^\{\}\|\`]*$/i;
var validIrcChannel = /^[\&|\#|\+|\!][^ \x07\,]+$/i;

io.sockets.on('connection', function (socket) {
	console.log('client connected');
	var client = null;

	
	socket.on('connect-details', function (data, cb) {
		console.log(data);
		var nick = data.nick;
		var channels = data.channels;

		if (!validIrcNick.test(nick)) {
			cb({error: "Invalid nick"});
			return;
		}
		if (!validIrcChannel.test(channels[0])) {
			cb({error: "Invalid channel"});
			return;
		}
		cb({});
		client = new irc.Client(config.server, nick, {
			channels: [channels[0]],
			stripColors: true
		});
		client.on('registered', function () {
			socket.emit('registered');
		});
		client.on('motd', function (motd) {
			socket.emit('motd', motd);
		});
	});
	socket.on('disconnect', function () {
		if (client) {
			client.disconnect();
			client = null;
		}
	});
});

