module.exports = ['$stateProvider', function($stateProvider) {
	$stateProvider
		.state('topics', {
			url: '/topics',
			template: require('./topics-template.html'),
			controller: 'TopicsController',
			controllerAs: 'topics'
		});
}];
