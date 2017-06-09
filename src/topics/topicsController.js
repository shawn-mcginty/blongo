class TopicsController {
	constructor($scope, $timeout, $stateParams) {
		this.topics = [];
		this.$scope = $scope;
		this.$timeout = $timeout;
		this._getTopics();
	}

	_getTopics() {
		fetch('/api/topics')
			.then((response) => {
				if (response.ok) {
					return response.json();
				}

				return [];
			}).then((topics) => {
				this.$timeout(() => this.$scope.$apply(() => {
					this.topics = topics.sort((a, b) => {
						if (a.count < b.count) {
							return -1;
						}

						if (a.count > b.count) {
							return 1;
						}

						return 0;
					});
				}));
			}).catch((err) => console.error(err));
	};
}

module.exports = TopicsController;