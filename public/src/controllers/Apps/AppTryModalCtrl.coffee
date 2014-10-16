module.exports = (app) ->
	app.controller('AppTryModalCtrl', ['$scope', '$rootScope', '$modalInstance', 'success', 'err', 'provider', 'key', 'type', 'backend', 
		($scope, $rootScope, $modalInstance, success, err, provider, key, type, backend) ->
			console.log "AppTryModalCtrl"
			$scope.success = success
			$scope.err = err
			$scope.provider = provider
			$scope.key = key
			$scope.type = type
			$scope.backend = backend
			console.log success, err, type

			$scope.close = () ->
				$modalInstance.dismiss()
		
		])