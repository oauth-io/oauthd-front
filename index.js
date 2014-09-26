module.exports = function(env) {
	var plugin = require('./bin/server.js')(env);
	return plugin;
}