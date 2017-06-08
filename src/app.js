const angular = require('angular');
const uirouter = require('angular-ui-router');

const config = require('./app.config');
const homeModule = require('./home/homeModule');
const signupModule = require('./signup/signupModule');
const loginModule = require('./login/loginModule');
const editorModule = require('./editor/editorModule');

angular.module('app', ['ui.router', homeModule, signupModule,
	loginModule, editorModule])
	.config(config);
