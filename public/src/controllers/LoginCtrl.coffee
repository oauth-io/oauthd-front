module.exports = (app) ->
	app.controller('LoginCtrl', ['$state', '$scope', '$rootScope', '$location', 'UserService',
		($state, $scope, $rootScope, $location, UserService) ->
			
			initCtrl = () ->
				$scope.error = undefined
				$scope.user = {}
				$('#emailInput').focus()
			
			login = (cb) ->
				UserService.login({
					email: $scope.user.email,
					pass: $scope.user.pass
				})
					.then (user) ->
						$state.go('dashboard.home')
						return
					.fail (e) ->
						$scope.error = e
						$scope.$apply()
						return
					.finally () ->
						return cb null

			$scope.submit = (form) ->
				if form.$name is "loginForm"
					$scope.loginSubmitted = true
				if form.$invalid
					return;
				login (cb) ->
					$scope.loginSubmitted = false

			initCtrl()
	])
