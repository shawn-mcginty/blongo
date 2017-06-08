module.exports = ['$stateProvider', function($stateProvider) {
	$stateProvider
		.state('editor', {
			url: '/editor',
			template: require('./editor-template.html'),
			controller: 'EditorController',
			controllerAs: 'editor'
		});
}];
