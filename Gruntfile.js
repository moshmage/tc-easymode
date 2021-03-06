module.exports = function(grunt) {
	var appGruntConfig = grunt.file.readJSON('grunt/config/appGruntConfig.json');
	grunt.initConfig({
		concat:{
			dist:{
				src: [
					appGruntConfig.path.common,
					appGruntConfig.path.initFile,
					appGruntConfig.path.modules,
					appGruntConfig.path.Ender
				],
				dest: appGruntConfig.path.destination
			}
		},
		uglify: {
			dist:{
				files:{
					'Torn_City_Mosh_Mods.user.js': [appGruntConfig.path.destination]
				}
			}
		},
		jshint: {
			files: [
				'Gruntfile.js',
				'<%= config.path.modules %>/*.js'
			],
			options: {
				globals: {
					jQuery: true
				}
			}
		}
	});

	grunt.registerTask('addUserScript','Adds required user.js string to built file', function() {
		var pkg = grunt.file.readJSON('package.json');
		var userModFile = grunt.file.read(appGruntConfig.path.userModFile);
		userModFile = userModFile.replace(/;version;/g,pkg.version).replace(/;description;/g,pkg.description);
		var builtFile = grunt.file.read(appGruntConfig.path.destination);
		grunt.file.write(appGruntConfig.path.destination,userModFile +'\n\r'+ builtFile);
		grunt.log.writeln('File ' + appGruntConfig.path.destination + ' user scripted');
	});

	grunt.registerTask('stamp','Stamps version number at the end of the file', function() {
		var pkg = grunt.file.readJSON('package.json');
		var builtFile = grunt.file.read(appGruntConfig.path.destination);
		var stamp = '\n\n/*\n * '+pkg.name + '\n * v'+ pkg.version+'\n * '+grunt.template.today("yyyy-mm-dd")+'\n */' + '\n' + 'console.log("TC - Easy Mode v'+pkg.version+'");';
		var stampedFile = builtFile +' '+ stamp;
		grunt.file.write(appGruntConfig.path.destination,stampedFile);

		grunt.log.writeln('File ' + appGruntConfig.path.destination + ' stamped.');
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint']);


	grunt.registerTask('build',[
		'concat',
		'uglify',
		'stamp',
		'addUserScript'
	]);

};

