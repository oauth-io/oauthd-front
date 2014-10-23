async = require 'async'

module.exports = (app) ->
	app.controller('DashboardCtrl', ['$state', '$scope', '$rootScope', '$location', 'UserService', 'AppService', 'PluginService'
		($state, $scope, $rootScope, $location, UserService, AppService, PluginService) ->
			if not $rootScope.accessToken? || $rootScope.loginData?.expires < new Date().getTime()
				$state.go 'login'
			PluginService.getAll()
				.then (plugins) ->
					$scope.plugins = plugins
					$scope.interface_enabled = 0
					for k, v of plugins
						if v.interface_enabled
							$scope.interface_enabled++
					$scope.$apply()
				.fail (e) ->
					console.log e

			$scope.state = $state
	])
