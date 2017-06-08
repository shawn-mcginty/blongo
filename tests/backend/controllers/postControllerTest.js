'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');

const postController = require('../../../server/controllers/postController');

describe('postController', () => {
	it('is defined', () => assert.isDefined(postController));

	describe('getPosts()', () => {
		let ogPostRepo;

		beforeEach(() => {
			ogPostRepo = postController._getPostRepo();
		});

		afterEach(() => {
			postController._setPostRepo(ogPostRepo);
		});

		it('is defined', () => assert.isDefined(postController.getPosts));

		it('calls postRepo.getPosts with correct filters', () => {
			const mockPostRepo = {
				getPosts: () => {},
			};
			const expectedSkip = 0;
			const expectedLimit = 10;
			const mockReq = {
				query: {},
			};
			const mockRes = {};
			sinon.stub(mockPostRepo, 'getPosts').returns(Promise.resolve([]));
			postController._setPostRepo(mockPostRepo);

			postController.getPosts(mockReq, mockRes);

			expect(mockPostRepo.getPosts.calledOnce).to.equal(true);
			expect(mockPostRepo.getPosts.getCall(0).args[0]).to.equal(expectedSkip);
			expect(mockPostRepo.getPosts.getCall(0).args[1]).to.equal(expectedLimit);
		});

		it('calls postRepo.getPosts with correct filters when given a page', () => {
			const mockPostRepo = {
				getPosts: () => {},
			};
			const expectedSkip = 60;
			const expectedLimit = 10;
			const mockReq = {
				query: {
					page: 7
				},
			};
			const mockRes = {};
			sinon.stub(mockPostRepo, 'getPosts').returns(Promise.resolve([]));
			postController._setPostRepo(mockPostRepo);

			postController.getPosts(mockReq, mockRes);

			expect(mockPostRepo.getPosts.calledOnce).to.equal(true);
			expect(mockPostRepo.getPosts.getCall(0).args[0]).to.equal(expectedSkip);
			expect(mockPostRepo.getPosts.getCall(0).args[1]).to.equal(expectedLimit);
		});
	});
});
