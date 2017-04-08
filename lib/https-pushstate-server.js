'use strict';

let express = require('express'),
    path = require('path'),
    _ = require('lodash'),
    https = require('https'),
    http = require('http'),
    fs = require('fs');

let pushstateServer = {
	server: null,
	port: null,

	createServer: function (options) {
		this.port = options.port || 8080;
		let rootDir = options.root;
		let dirs = options.dirs;
		let pkFile = options.keyPath;
		let certFile = options.certPath;

		let app = express();

		let getPath = function(url, type) {
			let paramsRemoved = _.first(url.split('?'));
			let filepath = _.last(paramsRemoved.split(type));
			return path.resolve(rootDir + '/' + type + filepath);
		};

		for (var i = 0; i < _.size(dirs); i++) {
			let dir = dirs[i];
			app.use("/"+dir, express.static(__dirname + '/' + dir));
		}

		if (options.https) {
			let sslInfo = {
				key: fs.readFileSync(pkFile).toString(),
				cert: fs.readFileSync(certFile).toString()
			};
			this.server = https.createServer(sslInfo, app);
    	}
		else {
		  this.server = http.createServer(app);
		}
		return this;
	},

	start: function (callback) {
		this.server.listen(this.port, callback);
	},

	stop: function () {
		this.server.close();
	}
};

module.exports = pushstateServer;
