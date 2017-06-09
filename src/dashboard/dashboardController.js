const moment = require('moment');

class DashboardController {
	constructor($scope, $timeout) {
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
		return fetch('/api/post/mine', { credentials: 'include' })
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
						this.error = 'You haven\'t written any yet!';
					}));
				}
			})
			.catch(err => {
				$timeout(() => $scope.$apply(() => this.error = err.message || err));
				console.error(this.error);
			});
	}

	delete(postId) {
		fetch(`/api/post/${postId}`, {
			credentials: 'include',
			method: 'delete',
		}).then((response) => {
			if (response.ok) {
				this._getPostsFromServer();
			} else {
				throw new Error('server failed to delete post');
			}
		}).catch((err) => {
			console.error(err);
			this.$timeout(() => this.$scope.$apply(() => this.error = 'Could not delete your post.'));
		});
	}
}

module.exports = DashboardController;