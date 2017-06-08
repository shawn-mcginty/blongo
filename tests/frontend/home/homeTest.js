'use strict';

const assert = chai.assert;
const expect = chai.expect;

describe('HomeController', () => {
	let $controller;

	beforeEach(() => {
		module('app');
		inject((_$controller_) => {
			$controller = _$controller_;
		});
	});

	afterEach(() => {
		if (window.fetch.restore) {
			window.fetch.restore();
		}
	})

	it('is defined', () => {
		let $scope = { $apply: (fn) => fn() };
		const HomeController = $controller('HomeController', { $scope });
		assert.isDefined(HomeController);
	});

	it('calls fetch API during instanciation', () => {
		sinon.stub(window, 'fetch').returns(Promise.resolve({ ok: false }));
		let $scope = { $apply: (fn) => fn() };
		const HomeController = $controller('HomeController', { $scope });
		return HomeController.promiseOf
			.then(() => {
				expect(window.fetch.calledOnce).to.equal(true);
				expect(window.fetch.calledWith('/api/posts?page=1')).to.equal(true);
			});
	});

	it('sets error if fetch fails', () => {
		sinon.stub(window, 'fetch').returns(Promise.resolve({ ok: false }));
		let $scope = { $apply: (fn) => fn() };
		const HomeController = $controller('HomeController', { $scope: $scope });

		return HomeController.promiseOf
			.then(() => expect(HomeController.error).to.equal('Could not load posts.'));
	});

	it('shows a cheeky error if fetch returns no posts', () => {
		sinon.stub(window, 'fetch').returns(Promise.resolve({ ok: true, json: () => [], }));
		let $scope = { $apply: (fn) => fn() };
		const HomeController = $controller('HomeController', { $scope: $scope });

		return HomeController.promiseOf
			.then(() => expect(HomeController.error).to.equal('Woah, I can\'t beleive no one has written' +
				' a post in this amazing blog site?!  Please sign up and do so!'));
		});
});
