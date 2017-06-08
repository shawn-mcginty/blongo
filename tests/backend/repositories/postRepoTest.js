'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const postRepo = require('../../../server/repositories/postRepo');

describe('postRepo', () => {
	it('is defined', () => assert.isDefined(postRepo));

	describe('getPosts()', () => {
		let ogPostModel;

		beforeEach(() => {
			ogPostModel = postRepo._getPostModel();
		});

		afterEach(() => {
			postRepo._setPostModel(ogPostModel);
		});

		it('is defined', () => assert.isDefined(postRepo.getPosts));

		it('returns a Promise', () => {
			expect(postRepo.getPosts()).to.be.instanceOf(Promise);
		});

		it('calls correct API with filters', () => {
			const mockPostModel = {
				find: () => {}
			};
			sinon.stub(mockPostModel, 'find').returns({ exec: () => Promise.resolve([]) });
			postRepo._setPostModel(mockPostModel);

			return postRepo.getPosts(0, 10)
				.then(() => {
					expect(mockPostModel.find.calledOnce).to.equal(true);
					expect(mockPostModel.find.getCall(0).args[2]).to.have.property('skip', 0);
					expect(mockPostModel.find.getCall(0).args[2]).to.have.property('limit', 10);
				});
		});
	});
});
