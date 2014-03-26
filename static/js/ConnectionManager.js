
var ConnectionManager = (function () {
	'use strict';

	function ConnectionManager() {
		var self = this;

		this.socket = io.connect('http://'+document.location.host, {
			"reconnection delay": 5*1000,
			"connect timeout": 30*1000
		});
		this.socket.on('disconnect', function () {
			this.isConnecting = false;
			this.isConnected = false;
			console.log("disconnect");
		});
		this.socket.on('connect', function () {
			console.log("connect!");
			self.timesConnected++;
		});
		this.socket.on('registered', function () {
			self.onRegistered();
		});
		this.socket.on('motd', function (motd) {
			self.onMotd(motd);
		});

		this.nick = '';
		this.channelNames = [];
		this.channels = {};
		this.isConnecting = false;
		this.isConnected = false;
		this.timesConnected = 0;

		this.onConnected = null;
		this.onConnectError = null;
		this.onRegistered = null;
		this.onMotd = null;
	}

	ConnectionManager.prototype.connect = function (cb) {
		var self = this;
		if (this.isConnected || this.isConnecting) {
			cb({error: 'Already connected'});
			return;
		}
		this.isConnecting = true;

		this.socket.emit('connect-details', {
			nick: this.nick,
			channels: this.channelNames
		}, function (data) {
			console.log("callback");
			if (data.error !== undefined) {
				self.onConnectError(data.error);
				self.isConnected = false;
				self.isConnecting = false;
			} else {
				self.isConnected = true;
				self.isConnecting = false;
				self.onConnected();
			}
		});
		
		/*this.socket.on('news', function (data) {
			console.log(data);
			socket.emit('my other event', { my: 'data' });
		});*/
	};

	return ConnectionManager;
}());
