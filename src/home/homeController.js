const moment = require('moment');

class HomeController {
	constructor($scope, $timeout, $stateParams) {
		this.page = 1;
		this.prev = null;
		this.next = null;
		this.error = null;
		this.sortBy = null;
		this.tag = null;
		this.posts = [];

		// special angular functions
		this.$scope = $scope;
		this.$timeout = $timeout;

		if ($stateParams) {
			if ($stateParams.page) {
				this.page = $stateParams.page;
			}

			if ($stateParams.sortBy) {
				this.sortBy = $stateParams.sortBy;
			}

			if ($stateParams.tag) {
				this.tag = $stateParams.tag;
			}
		};

		this.promiseOf = this._getPostsFromServer();
		this.setLabels();
	}

	_getPostsFromServer() {
		const $scope = this.$scope;
		const $timeout = this.$timeout;
		const sortBy = this.sortBy || 'newest';
		this.error = null;
		return fetch(`/api/post?page=${encodeURIComponent(this.page)}&sortBy=${encodeURIComponent(this.sortBy)}` +
				`&tag=${encodeURIComponent(this.tag)}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Could not load posts.');
					return [];
				}

				return response.json();
			}).then((response) => {
				$timeout(() => $scope.$apply(() => {
					if (response.current) {
						this.page = response.current;
					}

					if (response.prev) {
						this.prev = response.prev;
					}

					if (response.next) {
						this.next = response.next;
					}

					this.setLabels();
				}));
				return response.posts;
			}).then(posts => posts.map((post) => {
				post.displayDate = moment(post.publishedOn).fromNow();

				if (post.downvotes === null) {
					post.downvotes = 0;
				}

				if (post.upvotes === null) {
					post.upvotes = 0;
				}
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
				console.error(this.error);
			});
	}

	setLabels() {
		if (this.sortBy && this.sortBy !== 'newest') {
			if (this.sortBy === 'oldest') {
				this.prevLabel = 'Older';
				this.nextLabel = 'Newer';
			} else if (this.sortBy === 'coolest') {
				this.prevLabel = 'Cooler';
				this.nextLabel = 'Lamer';
			} else if (this.sortBy === 'lamest') {
				this.prevLabel = 'Lamer';
				this.nextLabel = 'Cooler'
			} else {
				this.prevLabel = 'Previous';
				this.nextLabel = 'Next';
			}
		} else {
			this.prevLabel = 'Newer';
			this.nextLabel = 'Older';
		}
	}

	getNextParams() {
		const params = {};
		params.page = this.next;

		if (this.sortBy && this.sortBy !== 'newest') {
			params.sortBy = this.sortBy;
		}

		return params;
	}

	getPrevParams() {
		const params = {};
		params.page = this.prev;

		if (this.prev === 1 || this.prev === '1') {
			params.page = null;
		}

		if (this.sortBy && this.sortBy !== 'newest') {
			params.sortBy = this.sortBy;
		}

		return params;
	}

	upvote(postId) {
		this.voted = this.voted || [];

		if (this.voted.filter(id => id === postId).length === 0) {
			this.voted.push(postId);

			fetch(`/api/post/${postId}/upvote`, {
				credentials: 'include',
				method: 'post',
			}).then((response) => {
				if (response.ok) {
					this.$timeout(() => this.$scope.$apply(() => {
						this.posts.forEach((post) => {
							if (post._id === postId) {
								post.upvotes = post.upvotes + 1;
							}
						});
					}));
				}
			}).catch((err) => console.error(err));
		} 
	}

	downvote(postId) {
		this.voted = this.voted || [];

		if (this.voted.filter(id => id === postId).length === 0) {
			this.voted.push(postId);
			
			fetch(`/api/post/${postId}/downvote`, {
				credentials: 'include',
				method: 'post',
			}).then((response) => {
				if (response.ok) {
					this.$timeout(() => this.$scope.$apply(() => {
						this.posts.forEach((post) => {
							if (post._id === postId) {
								post.downvotes = post.downvotes + 1;
							}
						});
					}));
				}
			}).catch((err) => console.error(err));
		}
	}
}

module.exports = HomeController;