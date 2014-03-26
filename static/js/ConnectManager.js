
var ConnectManager = (function () {
	'use strict';

	function ConnectManager() {
		var self = this;

		this.onConnectAttempt = null;

		this.canConnect = true;
		this.connectForm = $('#connectForm');
		this.inputNick = this.connectForm.find('#inputNick');
		this.inputChannels = this.connectForm.find('#inputChannels');
		this.submitLogin = this.connectForm.find('#submitLogin');
		this.errorNode = this.connectForm.find('#connectError');
		this.disableElements = [this.inputNick, this.inputChannels, this.submitLogin];

		this.connectForm.submit(function (e) {
			e.preventDefault();
			if (!self.canConnect) return;
			var nick = self.inputNick.val().trim();
			var channelNames = self.inputChannels.val().trim().split(",");
			self.errorNode.fadeOut(50);
			if (nick.length > 0 && channelNames.length > 0) {

				self.disable();

				self.onConnectAttempt(nick, channelNames);
			}
		});

		this.disable(false);
		this.inputNick.focus();
		this.errorNode.fadeOut(0);
	}

	ConnectManager.prototype.disable = function (doDisable) {
		if (typeof doDisable === 'undefined') {
			doDisable = true;
		}
		this.disableElements.forEach(function (elem) {
			elem.attr('disabled', doDisable);
		});
	};

	ConnectManager.prototype.failed = function (reason) {
		var self = this;
		this.disable(false);
		this.inputNick.focus();
		
		this.errorNode.html(reason || '');
		this.errorNode.fadeIn(300);
		this.canConnect = false;
		setTimeout(function () {
			self.canConnect = true;
		}, 300);
	};

	ConnectManager.prototype.disconnect = function (clearForm) {
		this.disable(false);
		if (clearForm) {
			this.inputNick.val("");
			this.inputChannels.val("");
		}
		this.inputNick.focus();
		this.canConnect = true;
	};

	return ConnectManager;
}());