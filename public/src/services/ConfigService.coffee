Q = require('q')

module.exports = (app) ->
	app.factory('ConfigService', ['$http', '$rootScope', '$location', 
		($http, $rootScope, $location) ->
			api = require('../utilities/apiCaller') $http, $rootScope
			config_service =
				getConfig: () ->
					defer = Q.defer()
					api "/config", ((data) ->
						defer.resolve data.data
						return
					), (e) ->
						defer.reject e
						return
					return defer.promise
			config_service
	])
