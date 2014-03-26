
var ChatManager = (function () {
	'use strict';

	var channelM = new ChannelManager();

	function ChatManager() {
		var self = this;

		this.sendChatCallback = null;

		this.chatContainer = $('#chatContainer');
		this.log = [];
		this.canChat = false;
		this.chatForm = $('#chatForm');
		this.inputChat = this.chatForm.find('#inputChat');
		this.submitChat = this.chatForm.find('#submitChat');
		this.disableElements = [this.inputChat, this.submitChat];

		this.chatForm.submit(function (e) {
			e.preventDefault();
			if (self.canChat && self.inputChat.val().length > 0) {
				self.sendChatCallback(self.inputChat.value);
				self.inputChat.value = '';
			}
		});
	}

	ChatManager.prototype.disable = function () {
		this.disableElements.forEach(function (elem) {
			elem.prop('disabled', true);
		});
		this.canChat = false;
		this.inputChat.blur();
	};
	ChatManager.prototype.enable = function () {
		this.disableElements.forEach(function (elem) {
			elem.disabled = false;
		});
		this.canChat = true;
		this.inputChat.focus();
	};

	ChatManager.prototype.addChat = function (channel, user, message) {
		var item = new ChatItem({type: ChatItem.TYPE_CHAT, user: user, message: message, timestamp: timestamp || new Date()});
		this.addItem(item);
	};

	ChatManager.prototype.addConsole = function (channel, message, className) {
		var item = new ChatItem({type: ChatItem.TYPE_CONSOLE, message: message, timestamp: timestamp || new Date()});
		if (typeof className === 'string') {
			item.node.classList.add(className);
		}
		this.addItem(item);
	};

	ChatManager.prototype.addItem = function (item) {
		this.log.push(item);
		this.chatContainer.appendChild(item.node);
		this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
	};

	ChatManager.prototype.clear = function () {
		while (this.log.length > 0) {
			this.chatContainer.removeChild(this.log[0].node);
		}
	};

	return ChatManager;
}());
