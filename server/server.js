'use strict';

const path = require('path');

const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

const port = 3000;

const viewsDir = path.join(__dirname, 'views');
const mongooseUtils = require('./utils/mongoose');

mongooseUtils.bootstrapDb()
	.then(() => {
		// requires are done after database connection is established
		const passport = require('./utils/passport');
		const postController = require('./controllers/postController');
		const userController = require('./controllers/userController');
		const markdownController = require('./controllers/markdownController');

		app.use(cookieParser());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(expressSession({
			secret: 'there is no spoon',
			resave: true,
			saveUninitialized: true,
		}));
		app.use(flash());
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(express.static('public'));
		app.set('view engine', 'pug');

		// setup api endpoints
		app.get('/api/post', postController.getPosts);
		app.post('/api/post', postController.createPost);
		app.get('/api/post/mine', postController.getUserPosts)
		app.get('/api/user/count', userController.getUserCount);
		app.post('/api/markdown', markdownController.mdToHtml);

		// catch all other api endpoints with a 404
		app.get('/api/*', (req, res) => res.sendStatus(404));

		// everything else goes to the frontend
		app.post('/signup', userController.signUserUp);
		app.post('/login', passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true,
		}));
		app.get('/logout', (req, res) => {
			req.logout();
			res.redirect('/');
		})
		app.get('/*', (req, res) => {
			res.render(`${viewsDir}/home`, {
				currentUser: req.user,
				errorMessages: req.flash('error'),
			})
		});

		app.listen(port, () => {
			console.log('Example app listening on port 3000!');
		});
	}).catch((err) => {
		console.error(err);
		process.exit(1);
	});
