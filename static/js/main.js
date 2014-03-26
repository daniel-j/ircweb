// main
(function () {
	'use strict';

	var views       = new ViewManager();
	var connectM    = new ConnectManager();
	var network     = new ConnectionManager();
	var chat        = new ChatManager();

	var connectHidden = false;

	function hideConnect() {
		views.addStateFor('connect', 'top');
		views.removeStateFor('chat', 'behind');
		connectHidden = true;
	}
	function showConnect() {
		views.removeStateFor('connect', 'top');
		views.addStateFor('chat', 'behind');
		connectHidden = false;
	}

	connectM.onConnectAttempt = function (nick, channelNames) {
		network.nick = nick;
		network.channelNames = channelNames;

		network.connect();
	};
	
	network.onConnected = function () {
		hideConnect();
	};
	network.onConnectError = function (message) {
		connectM.failed(message);
	};
	network.onRegistered = function () {
		chat.enable();
	};
	network.onMotd = function (motd) {
		console.log(motd);
	};

	$('#inputNick').val("Pony_"+((Math.random()*10000)|0));
	
}());

