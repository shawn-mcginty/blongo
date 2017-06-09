'use strict';

const markdown = require('markdown').markdown;
let PostModel = require('../models/PostModel');

exports.getPosts = (skip, limit, sortBy, filterTag) => {
	let filters = null;
	let sortString = '-publishedOn';

	if (sortBy === 'oldest') {
		sortString = 'publishedOn';
	} else if (sortBy === 'coolest') {
		sortString = '-popularity'
	} else if (sortBy === 'lamest') {
		sortString = 'popularity'
	}

	if (filterTag) {
		filters = { tags: filterTag }
	}

	return PostModel.find(filters, null, {skip, limit})
		.populate('author')
		.sort(sortString)
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
};

exports.getNumberOfPages = (pageSize) => PostModel.count()
	.exec()
	.then((totalModels) => Math.ceil(totalModels / pageSize))

exports.getPostById = (id) => PostModel.findOne({_id: id}).exec();

exports.getPostsByAuthor = (authorId) => PostModel.find({author: authorId}, 'title publishedOn id')
	.lean()
	.exec();

exports.createPost = (post) => PostModel.create(post);

exports.deletePost = (id) => PostModel.deleteOne({_id: id}).exec();

exports.getAllTags = () => PostModel.find(null, 'tags').lean().exec();

/**
 * DI - don't use in real code
 */
exports._getPostModel = () => PostModel;
exports._setPostModel = (NewModel) => PostModel = NewModel;