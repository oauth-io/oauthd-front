restify = require 'restify'
ecstatic = require 'ecstatic'
fs = require 'fs'

module.exports = (env) ->
	exp = {}
	exp.setup = (callback) ->
		env.server.get /^(\/.*)/, (req, res, next) ->
			if req.params[0] == '/'
				res.setHeader 'Location', '/home'
				res.send 302

			fs.stat __dirname + '/public' + req.params[0], (err, stat) ->
				if stat?.isFile()
					next()
					return
				else
					fs.readFile __dirname + '/public/index.html', {encoding: 'UTF-8'}, (err, data) ->
						res.setHeader 'Content-Type', 'text/html'
						res.send 200, data
						return
		, restify.serveStatic
			directory: __dirname + '/public'
			default: __dirname + '/public/index.html'
		callback()

	exp