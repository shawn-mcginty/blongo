'use strict';

const mongoose = require('mongoose');

const DB_HOST = 'localhost';
const DB_NAME = 'blongo-dev';

// config mongoose to use native Promise API
mongoose.Promise = Promise;

/**
 * Creates DB connection, needs to be one of the first thing we do
 * when booting up the server.
 * 
 * @return Promise<Void>
 */
exports.bootstrapDb = () => new Promise((resolve, reject) => {
	mongoose.connect(`mongodb://${DB_HOST}/${DB_NAME}`);
	const db = mongoose.connection;

	db.on('error', err => reject(err));
	db.once('open', () => resolve());
});