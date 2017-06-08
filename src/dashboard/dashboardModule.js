const angular = require('angular');
const uirouter = require('angular-ui-router');

const config = require('./dashboardConfig');
const DashboardController = require('./dashboardController');

module.exports = angular.module('app.editor', ['ui.router',])
	.config(config)
	.controller('DashboardController', ['$scope', '$timeout', DashboardController])
	.name;