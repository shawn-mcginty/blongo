module.exports = ['$stateProvider', function($stateProvider) {
	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			template: require('./dashboard-template.html'),
			controller: 'DashboardController',
			controllerAs: 'dashboard'
		});
}];
