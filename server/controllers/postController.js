'use strict';

let postRepo = require('../repositories/postRepo');

exports.getPosts = (req, res) => {
	const page = req.query.page || 1;
	const pageSize = 10;
	const skip = page * pageSize - pageSize;

	postRepo.getPosts(skip, pageSize)
		.then((posts) => {
			res.send(posts);
		});
};

exports.createPost = (req, res) => {
	const post = {
		body: req.body.body,
		title: req.body.title,
		author: req.user.id,
		tags: req.body.tags,
		published: true,
		publishedOn: new Date(),
		upvotes: 0,
		downvotes: 0,
	};

	postRepo.createPost(post)
		.then(() => res.sendStatus(201))
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
}

exports.getUserPosts = (req, res) => {
	postRepo.getPostsByAuthor(req.user.id)
		.then((posts) => res.send(posts))
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
}

/**
 * DI - don't use outside of testing
 */
exports._setPostRepo = (newDep) => postRepo = newDep;
exports._getPostRepo = () => postRepo;