'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const userRepo = require('../../../server/repositories/userRepo');

describe('userRepo', () => {
	it('is defined', () => assert.isDefined(userRepo));

	describe('getUsers()', () => {
		let ogUserModel;

		beforeEach(() => {
			ogUserModel = userRepo._getUserModel();
		});

		afterEach(() => {
			userRepo._setUserModel(ogUserModel);
		});

		it('is defined', () => assert.isDefined(userRepo.getUsers));

		it('returns a Promise', () => expect(userRepo.getUsers()).to.be.instanceOf(Promise));

		it('calls right query API for emails', () => {
			const mockUserModel = {
				find: () => {},
			};
			sinon.stub(mockUserModel, 'find').returns({ exec: () => Promise.resolve([]) });
			userRepo._setUserModel(mockUserModel);
			const expectedEmail = 'foo@bar.com';

			return userRepo.getUsers({ email: expectedEmail })
				.then(() => {
					expect(mockUserModel.find.calledOnce).to.equal(true);
					expect(mockUserModel.find.getCall(0).args[0]).to.have.property('email', expectedEmail);
				});
		});
	});
});
