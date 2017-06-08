const moment = require('moment');

class HomeController {
	constructor($scope, $timeout) {
		this.page = 1;
		this.error = null;
		this.posts = [];

		// special angular functions
		this.$scope = $scope;
		this.$timeout = $timeout;

		this.promiseOf = this._getPostsFromServer();
	}

	_getPostsFromServer() {
		const $scope = this.$scope;
		const $timeout = this.$timeout;
		this.error = null;
		return fetch(`/api/post?page=${encodeURIComponent(this.page)}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Could not load posts.');
					return [];
				}

				return response.json();
			}).then(posts => posts.map((post) => {
				post.displayDate = moment(post.publishedOn).fromNow();
				return post;
			})).then(posts => {
				if (Array.isArray(posts) && posts.length > 0) {
					$timeout(() => $scope.$apply(() => this.posts = posts));
				} else {
					$timeout(() => $scope.$apply(() => {
						this.error = 'Woah, I can\'t beleive no one has written' +
							' a post in this amazing blog site?!  Please sign up and do so!';
					}));
				}
			})
			.catch(err => {
				$timeout(() => $scope.$apply(() => this.error = err.message || err));
				console.log(this.error);
			});
	}
}

module.exports = HomeController;