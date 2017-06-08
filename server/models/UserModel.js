'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	displayName: String,
	email: String,
	password: String,
	posts: [{ type: Schema.Types.ObjectId, ref: 'Post'}]
});

let UserModel;

try {
	UserModel = mongoose.model('User');
} catch (err) {
	console.log('Bootstrapping user model');
	UserModel = mongoose.model('User', userSchema);
}

module.exports = UserModel;