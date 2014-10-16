module.exports = (app) ->
	app.controller 'PluginShowCtrl', ['$state', '$scope', '$stateParams', 'PluginService',
		($state, $scope, $stateParams, PluginService) ->
			if not $stateParams.plugin or $stateParams.plugin is ""
				$state.go 'home'
			PluginService.get($stateParams.plugin)
				.then (plugin) ->
					plugin.url = "/oauthd/plugins/" + plugin.name
					$scope.plugin = plugin
				.fail (e) ->
					console.log e
				.finally () ->
					$scope.$apply()
	]