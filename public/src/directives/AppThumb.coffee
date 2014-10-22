module.exports = (app) ->
	app.directive 'appthumb', ["$rootScope", ($rootScope) ->
		return {
			restrict: 'AE'
			templateUrl: '/templates/apps/thumb.html'
			replace: true
			scope: {
				app: '='
			}
			link: ($scope, $element) ->
				return
		}
	]