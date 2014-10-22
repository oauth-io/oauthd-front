async = require 'async'

module.exports = (app) ->
	app.controller 'HelpCtrl', ['$scope', '$state', '$rootScope','ConfigService',
		($scope, $state, $rootScope, ConfigService) ->
			ConfigService.getConfig()
				.then (config) ->
					$scope.config = config
				.fail (e) ->
					console.log "HomeCtrl getConfig error", e
				.finally () ->
					$scope.$apply()
	]