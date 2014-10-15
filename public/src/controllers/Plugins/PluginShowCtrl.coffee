module.exports = (app) ->
	app.controller 'PluginShowCtrl', ['$state', '$scope', 'PluginService', 
		($state, $scope, PluginService) ->
			$scope.hello = 'test'
	]