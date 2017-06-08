'use strict';

const path = require('path');

module.exports = {
	entry: path.join(__dirname,'src/app.js'),
	output: {
		filename: 'public/js/bundle.js',
	},
	module:{
		rules: [ {
    		test: /\.(js)$/,
    		use: 'babel-loader',
            exclude: /node_modules/,
    	}, {
    		test: /\.(html)$/,
    		use: 'html-loader',
    	} ],
    },
};