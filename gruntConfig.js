'use strict';

module.exports = function(gruntConf) {

	gruntConf.coffee['default_front'] = {
		expand: true,
		cwd: __dirname,
		src: ['*.coffee'],
		dest: __dirname + '/bin',
		ext: '.js',
		options: {
			bare: true
		}
	};

	gruntConf.watch['default_front'] = {
		files: [
			__dirname + '/**/*.coffee'
		],
		tasks: ['coffee:default_front']
	};

	gruntConf.watch['front'] = {
		files: [
			__dirname + '/**/*.coffee',
			__dirname + '/public/**/*'
		],
		tasks: ['subgrunt:front']
	};

	return function() {

	}
}