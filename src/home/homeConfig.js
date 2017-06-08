module.exports = ['$stateProvider', function($stateProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			template: require('./home-template.html'),
			controller: 'HomeController',
			controllerAs: 'home'
		});
}];
