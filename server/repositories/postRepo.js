'use strict';

const markdown = require('markdown').markdown;
let PostModel = require('../models/PostModel');

exports.getPosts = (skip, limit) => PostModel.find(null, null, {skip, limit})
	.populate('author')
	.lean()
	.exec()
	.then(posts => posts.map(post => {
		post.author = post.author.displayName;
		return post;
	}))
	.then(posts => posts.map(post => {
		post.body = markdown.toHTML(post.body);
		return post;
	}));

exports.getPostsByAuthor = (authorId) => PostModel.find({author: authorId}, 'title id')
	.lean()
	.exec();

exports.createPost = (post) => PostModel.create(post);

/**
 * DI - don't use in real code
 */
exports._getPostModel = () => PostModel;
exports._setPostModel = (NewModel) => PostModel = NewModel;