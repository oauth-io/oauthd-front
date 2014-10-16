module.exports = (app) ->
	app.controller 'PluginShowCtrl', ['$state', '$scope', '$stateParams', 'PluginService',
		($state, $scope, $stateParams, PluginService) ->
			if not $stateParams.plugin or $stateParams.plugin is ""
				$state.go 'home'
			PluginService.get($stateParams.plugin)
				.then (plugin) ->
					if plugin.interface_enabled
						plugin.url = "/plugins/" + plugin.name + '/index.html'
					$scope.plugin = plugin
				.fail (e) ->
					console.log 'An error occured', e
				.finally () ->
					$scope.$apply()
	]