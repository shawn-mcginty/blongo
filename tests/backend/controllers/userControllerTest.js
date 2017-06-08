'use strict';

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');

const userController = require('../../../server/controllers/userController');

describe('userController', () => {
	it('is defined', () => assert.isDefined(userController));

	describe('getUserCount()', () => {
		let ogUserRepo;

		beforeEach(() => {
			ogUserRepo = userController._getUserRepo();
		});

		afterEach(() => {
			userController._setUserRepo(ogUserRepo);
		});

		it('is defined', () => assert.isDefined(userController.getUserCount));

		it('calls userRepo.getUsers with correct filters', () => {
			const expectedEmail = 'foo@bar.com';
			const mockUserRepo = {
				getUsers: () => {},
			};
			const mockReq = {
				query: {
					email: expectedEmail,
				},
			};
			const mockRes = {
				send: () => {},
			};
			sinon.stub(mockUserRepo, 'getUsers').returns(Promise.resolve([]));
			userController._setUserRepo(mockUserRepo);

			userController.getUserCount(mockReq, mockRes);

			expect(mockUserRepo.getUsers.calledOnce).to.equal(true);
			expect(mockUserRepo.getUsers.getCall(0).args[0]).to.have.property('email', expectedEmail);
		});
	});
});
