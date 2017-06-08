const angular = require('angular');
const uirouter = require('angular-ui-router');

const config = require('./signupConfig');
const SignupController = require('./signupController');

module.exports = angular.module('app.signup', ['ui.router'])
	.config(config)
	.controller('SignupController', ['$scope', '$timeout', SignupController])
	.name;