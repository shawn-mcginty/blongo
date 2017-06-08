module.exports = ['$stateProvider', function($stateProvider) {
	$stateProvider
		.state('signup', {
			url: '/signup',
			template: require('./signup-template.html'),
			controller: 'SignupController',
			controllerAs: 'signup'
		});
}];
