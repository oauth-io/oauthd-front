async = require 'async'

module.exports = (app) ->
	app.controller('DashboardCtrl', ['$state', '$scope', '$rootScope', '$location', 'UserService', 'AppService', 'PluginService'
		($state, $scope, $rootScope, $location, UserService, AppService, PluginService) ->
			if not $rootScope.accessToken? || $rootScope.loginData?.expires < new Date().getTime()
				$state.go 'login'
			PluginService.getAll()
				.then (plugins) ->
					$scope.plugins = plugins
					$scope.$apply()
				.fail (e) ->
					console.log e

			$scope.state = $state
	])
