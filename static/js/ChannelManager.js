
var ChannelManager = (function () {
	'use strict';

	function ChannelManager() {
		var self = this;

		this.tabs = $('#tabs ul');

		this.channels = {};
	}

	ChannelManager.prototype.addChannel = function (name) {
		if (this.channels[name]) {
			return;
		}

		var chatCont = $('<div class="chatContainer"></div>');
		var userlist = $('<div class="userlist"></div>');

		this.channels[name] = {
			chatContainer: chatCont,
			userlist: userlist
		}
	}

	return ChannelManager;
}());