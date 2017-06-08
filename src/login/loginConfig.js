module.exports = ['$stateProvider', function($stateProvider) {
	$stateProvider
		.state('login', {
			url: '/login',
			template: require('./login-template.html'),
			controller: 'LoginController',
			controllerAs: 'login'
		});
}];
