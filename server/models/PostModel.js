'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
	title: String,
	body: String,
	tags: Array,
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	upvotes: Number,
	downvotes: Number,
	popularity: Number,
	published: Boolean,
	publishedOn: Date,
	voters: Array,
});

let PostModel;

try {
	PostModel = mongoose.model('Post');
} catch (err) {
	console.log('Bootstraping post model');
	PostModel = mongoose.model('Post', postSchema);
}

module.exports = PostModel;
