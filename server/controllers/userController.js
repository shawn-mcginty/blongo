'use strict';

let userRepo = require('../repositories/userRepo');
const cryptoUtils = require('../utils/crypto');

exports.getUserCount = (req, res) => {
	const filters = {};
	if (req.query.email) {
		filters.email = req.query.email;
	}

	if (req.query.displayName) {
		filters.displayName = req.query.displayName;
	}

	userRepo.getUsers(filters)
		.then(users => users.length)
		.then(count => res.send({count}))
		.catch((err) => {
			console.error(err);
			res.send(500);
		});
};

exports.signUserUp = (req, res) => {
	const user = {
		email: req.body.email,
		password: cryptoUtils.getHash(req.body.password),
		displayName: req.body.displayName,
	};

	userRepo.createUser(user)
		.then(() => res.sendStatus(201))
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};

/**
 * DI - don't use outside of testing
 */
exports._setUserRepo = (newDep) => userRepo = newDep;
exports._getUserRepo = () => userRepo;