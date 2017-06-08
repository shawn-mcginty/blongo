class EditorController {
	constructor($scope, $timeout) {
		this.title;
		this.tags;
		this.body;
		this.preview;
		this.errorMessage = null;

		// special angular functions
		this.$scope = $scope;
		this.$timeout = $timeout;
	}

	showPreview() {
		if (this.body) {
			fetch('/api/markdown', {
				credentials: 'include',
				method: 'post',
				body: JSON.stringify({ md: this.body }),
				headers: { 'Content-Type': 'application/json' },
			}).then((response) => {
				if (response.ok) {
					return response.json();
				}

				return null;
			}).then((response) => {
				if (response) {
					return response.html;
				}

				return response;
			}).then((html) => this.$timeout(() => this.$scope.$apply(() => this.preview = html)))
			.catch((err) => {
				console.error(err);
			});
		} else {
			this.preview = null;
		}
	}

	save() {
		if (!this.body) {
			this.errorMessage = 'You can\'t really save your post without a body.' +
				'  Give the people what they want!';
		} else if (!this.title) {
			this.errorMessage = 'Every post needs a catchy title, don\'t you think?';
		} else {
			const tags = this.tags || '';
			fetch('/api/post', {
				method: 'post',
				credentials: 'include',
				body: JSON.stringify({
					title: this.title,
					body: this.body,
					tags: tags.split(',')
								.map(tag => tag.trim())
								.filter(tag => tag !== ''),
				}),
				headers: { 'Content-type': 'application/json' }
			}).then((response) => {
				if (response.ok) {
					// success! go to dashboard
				} else {
					this.$timeout(() => this.$scope.$apply(() => {
						this.errorMessage = 'For some reson your article can\'t be saved.  ' +
							'You can try again later if you want.';
					}));
				}
			})
		}
	}

	clearErrorMessage() {
		this.errorMessage = null;
	}
}

module.exports = EditorController;