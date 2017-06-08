'use strict';

const crypto = require('crypto');

const secret = 'K33p it s3cr3t, k33p it safe';

exports.getHash = (str) => crypto.createHmac('sha256', secret)
	.update(str)
	.digest('hex');
