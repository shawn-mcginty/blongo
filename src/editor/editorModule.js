const angular = require('angular');
const uirouter = require('angular-ui-router');
const ngSanitize = require('angular-sanitize');

const config = require('./editorConfig');
const EditorController = require('./editorController');

module.exports = angular.module('app.editor', ['ui.router', 'ngSanitize'])
	.config(config)
	.controller('EditorController', ['$scope', '$timeout', '$stateParams', EditorController])
	.name;