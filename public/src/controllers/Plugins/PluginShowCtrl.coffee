module.exports = (app) ->
	app.controller 'PluginShowCtrl', ['$state', '$scope', '$stateParams', 'PluginService',
		($state, $scope, $stateParams, PluginService) ->
			if not $stateParams.plugin or $stateParams.plugin is ""
				$state.go 'home'
			PluginService.get($stateParams.plugin)
				.then (plugin) ->
					console.log "plugin", plugin
					plugin.url = "/oauthd/plugins/" + plugin.name
					$scope.plugin = plugin
					console.log "$scope.plugin", $scope.plugin
				.fail (e) ->
					console.log e
				.finally () ->
					$scope.$apply()
	]