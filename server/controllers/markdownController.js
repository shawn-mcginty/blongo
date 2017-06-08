'use strict';

const markdown = require('markdown').markdown;

exports.mdToHtml = (req, res) => {
	if (req.body && req.body.md) {
		res.send({ html: markdown.toHTML(req.body.md) });
	} else {
		res.send({ html: null });
	}
};
