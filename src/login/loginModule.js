const angular = require('angular');
const uirouter = require('angular-ui-router');

const config = require('./loginConfig');
const LoginController = require('./loginController');

module.exports = angular.module('app.login', ['ui.router'])
	.config(config)
	.controller('LoginController', [LoginController])
	.name;