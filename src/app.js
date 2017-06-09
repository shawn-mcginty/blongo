const angular = require('angular');
const uirouter = require('angular-ui-router');

const config = require('./app.config');
const homeModule = require('./home/homeModule');
const signupModule = require('./signup/signupModule');
const loginModule = require('./login/loginModule');
const editorModule = require('./editor/editorModule');
const dashboardModule = require('./dashboard/dashboardModule');
const topicsModule = require('./topics/topicsModule');

angular.module('app', ['ui.router', homeModule, signupModule,
	loginModule, editorModule, dashboardModule, topicsModule])
	.config(config);
