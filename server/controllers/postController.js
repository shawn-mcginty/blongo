'use strict';

let postRepo = require('../repositories/postRepo');

exports.getPosts = (req, res) => {
	let page = 1;
	let sortBy = 'newest';
	let filterTag = null;
	const pageSize = 5;

	if (req.query.page && req.query.page !== 'null') {
		page = req.query.page;
	}

	if (req.query.sortBy && req.query.sortBy !== 'null') {
		sortBy = req.query.sortBy;
	}

	if (req.query.tag && req.query.tag !== 'null') {
		filterTag = req.query.tag;
	}

	const skip = page * pageSize - pageSize;

	postRepo.getPosts(skip, pageSize, sortBy, filterTag)
		.then((posts) => {
			const response = {
				posts,
			};
			if (page > 1) {
				response.prev = page - 1;
			}

			response.current = page;
			return postRepo.getNumberOfPages(pageSize)
				.then((maxPageNumber) => {
					if (maxPageNumber > page) {
						response.next = +page + 1;
					}

					return response;
				});
		}).then((response) => res.send(response))
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
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
		popularity: 0,
	};

	// set all tags to lower, and remove duplicates
	post.tags = post.tags
		.map(tag => tag.toLowerCase())
		.filter((tag, i, tags) => tags.indexOf(tag) == i);

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

exports.updateUserPost = (req, res) => {
	const userId = req.user.id;

	const update = {};

	if (req.body.title) {
		update.title = req.body.title;
	}

	if (req.body.body) {
		update.body = req.body.body;
	}

	if (req.body.tags) {
		update.tags = req.body.tags;
		// set all tags to lower, and remove duplicates
		post.tags = post.tags
			.map(tag => tag.toLowerCase())
			.filter((tag, i, tags) => tags.indexOf(tag) == i);
	}

	postRepo.getPostById(req.params.postId)
		.then((post) => {
			if (post === null) {
				return Promise.reject({ hasHttpStatus: true, status: 404 }); //not found
			} else if (post.author != userId) {
				return Promise.reject({ hasHttpStatus: true, status: 401 }); //not authorized
			} else {
				return post.set(update).save();
			}
		}).then(() => res.sendStatus(200))
		.catch((err) => {
			if (err.hasHttpStatus) {
				res.sendStatus(err.status);
			} else {
				console.error(err);
				res.sendStatus(500);
			}
		});
};

exports.deleteUserPost = (req, res) => {
	const userId = req.user.id;

	postRepo.getPostById(req.params.postId)
		.then((post) => {
			if (post === null) {
				return Promise.reject({ hasHttpStatus: true, status: 404 }); //not found
			} else if (post.author != userId) {
				return Promise.reject({ hasHttpStatus: true, status: 401 }); //not authorized
			} else {
				return postRepo.deletePost(post.id);
			}
		}).then(() => res.sendStatus(200))
		.catch((err) => {
			if (err.hasHttpStatus) {
				res.sendStatus(err.status);
			} else {
				console.error(err);
				res.sendStatus(500);
			}
		});
};

exports.getPostById = (req, res) => {
	postRepo.getPostById(req.params.postId)
		.then((post) => {
			if (post === null) {
				res.sendStatus(404); // not found
				return;
			}

			res.send(post);
		}).catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};

exports.upvotePost = (req, res) => {
	const userId = req.user.id;

	postRepo.getPostById(req.params.postId)
		.then((post) => {
			if (post === null) {
				return Promise.reject({ hasHttpStatus: true, status: 404}); // not found
			}

			if (post.voters.filter(voter => voter == userId).length === 0) {
				post.set('upvotes', post.upvotes + 1);
				post.voters.push(userId);
				post.popularity = post.upvotes - post.downvotes;
				return post.save();
			}

			return Promise.reject({ hasHttpStatus: true, status: 401 });
		}).then(() => res.sendStatus(200))
		.catch((err) => {
			if (err.hasHttpStatus) {
				res.sendStatus(err.status);
				return;
			}
			console.error(err);
		});
}

exports.downvotePost = (req, res) => {
	const userId = req.user.id;

	postRepo.getPostById(req.params.postId)
		.then((post) => {
			if (post === null) {
				return Promise.reject({ hasHttpStatus: true, status: 404}); // not found
			}

			if (post.voters.filter(voter => voter == userId).length === 0) {
				post.set('downvotes', post.downvotes + 1);
				post.voters.push(userId);
				post.popularity = post.upvotes - post.downvotes;
				return post.save();
			}

			return Promise.reject({ hasHttpStatus: true, status: 401 });
		}).then(() => res.sendStatus(200))
		.catch((err) => {
			if (err.hasHttpStatus) {
				res.sendStatus(err.status);
				return;
			}
			console.error(err);
		});
}

exports.getTopics = (req, res) => {
	const topics = [];
	postRepo.getAllTags()
		.then((posts) => posts.map((post) => post.tags))
		.then((tagSets) => {
			tagSets.forEach(tagSet => {
				tagSet.forEach(tag => {
					let inList = false;
					topics.forEach(topic => {
						if (topic.tag.toLowerCase() === tag) {
							topic.count++;
						} else {
							inList = true;
						}
					});
					
					topics.push({ tag, count: 1 });
				});
			});
		}).then(() => res.send(topics))
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};

/**
 * DI - don't use outside of testing
 */
exports._setPostRepo = (newDep) => postRepo = newDep;
exports._getPostRepo = () => postRepo;