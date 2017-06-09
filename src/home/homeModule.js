const angular = require('angular');
const uirouter = require('angular-ui-router');
const ngSanitize = require('angular-sanitize');

const config = require('./homeConfig');
const HomeController = require('./homeController');

module.exports = angular.module('app.home', ['ui.router', 'ngSanitize'])
	.config(config)
	.controller('HomeController', ['$scope', '$timeout', '$stateParams', HomeController])
	.name;