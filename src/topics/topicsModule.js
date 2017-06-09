const angular = require('angular');
const uirouter = require('angular-ui-router');

const config = require('./topicsConfig');
const TopicsController = require('./topicsController');

module.exports = angular.module('app.topics', ['ui.router'])
	.config(config)
	.controller('TopicsController', ['$scope', '$timeout', TopicsController])
	.name;