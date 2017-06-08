module.exports = ['$urlRouterProvider', '$locationProvider', function($urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
}];