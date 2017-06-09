module.exports = ['$stateProvider', function($stateProvider) {
	$stateProvider
		.state('home', {
			url: '/?page&sortBy&tag',
			template: require('./home-template.html'),
			controller: 'HomeController',
			controllerAs: 'home'
		});
}];
