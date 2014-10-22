async = require 'async'

module.exports = (app) ->
	app.controller 'HomeCtrl', ['$scope', '$state', '$rootScope', '$location', 'UserService', 'AppService', 'PluginService', 'ConfigService',
		($scope, $state, $rootScope, $location, UserService, AppService, PluginService, ConfigService) ->
			
			$scope.count = (object) ->
				count = 0
				for k,v of object
					count++
				return count

			initCtrl = () ->
				$scope.providers = {}
				$scope.loadingApps = true
				AppService.all()
					.then (apps) ->	
						$scope.apps = apps
						async.eachSeries apps, (app, next) ->
							AppService.get app.key
								.then (app_data) ->
									for j of app_data
										app[j] = app_data[j]
										
									for k,v of app_data.keysets
										$scope.providers[v] = true
									next()
								.fail (e) ->
									console.log e
									next()
						, (err) ->
							$scope.$apply()
					.fail (e) ->
						console.log "HomeCtrl getAllApps error ", e
					.finally () ->
						$scope.loadingApps = false
						$scope.$apply()

				PluginService.getAll()
					.then (plugins) ->
						$scope.plugins = []
						for plugin in plugins
							plugin.url = "/oauthd/plugins/" + plugin.name
							$scope.plugins.push plugin
					.fail (e) ->
						console.log e
					.finally () ->
						$scope.$apply()

				$scope.loadingConfig = true
				ConfigService.getConfig()
					.then (config) ->
						$scope.config = config
					.fail (e) ->
						console.log "HomeCtrl getConfig error", e
					.finally () ->
						$scope.loadingConfig = false
						$scope.$apply()

			initCtrl()
	]