'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const userRepo = require('../repositories/userRepo');
const cryptoUtils = require('../utils/crypto');

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
}, (email, password, done) => {
	const filters = {
		email,
		password: cryptoUtils.getHash(password),
	};

	userRepo.getUsers(filters)
		.then((usersFound) => {
			if (usersFound.length > 0) {
				return usersFound[0];
			}

			return null;
		}).then((user) => {
			if (user) {
				done(null, user);
			} else {
				console.log('should have flash message');
				done(null, false, { message: 'Incorrect email or password' });
			}
		}).catch(err => {
			console.error(err);
			done(err);
		});
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => userRepo.getUsers({ _id: id })
	.then((usersFound) => {
		if (usersFound.length > 0) {
			return usersFound[0];
		}

		return null;
	}).then(user => done(null, user))
	.catch(err => done(err, null)));

module.exports = passport;
