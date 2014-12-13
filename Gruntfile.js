'use strict';
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    project: {
      app: ['app'],
      css: ['<%= project.app %>/css/**/*.css'],
      alljs: ['<%= project.app %>/js/**/*.js']
    },

    jshint: {
      src: ['server.js', 'app/js/**/*.js', 'Gruntfile.js', 'test/server/*.js',
      'test/client/*.js'],
      options: {
        node: true
      }
    },
//
    jscs: {
      src: ['lib/*.js', 'routes/*.js', 'server.js', 'models/*.js'],
      options: {
        config: '.jscsrc'
      }
    },

    simplemocha: {
      src: ['test/server/*.js']
    },

    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: 'app/scss/',
          src: ['*.scss', '*.sass'],
          dest: 'build/css',
          ext: '.css'
        }]
      }
    },

    clean: {
      dev: {
        src: ['build/']
      }
    },

    copy: {
      dev: {
        cwd: 'app/',
        src: ['**/*.html'],
        expand: true,
        dest: 'build/'
      }
    },

    browserify: {
      dev: {
        src: ['app/js/**/*.js'],
        dest: 'build/client_bundle.js',
        options: {
          transform: ['debowerify']
        }
      },

      test: {
        src: ['test/client/**/*.js'],
        dest: 'test/angular_testbundle.js',
        options: {
          transform: ['debowerify']
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.config.js'
      },
      continuous: {
        configFile: 'karma.config.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },

    express: {
      options: {
         // Override defaults here
         output: 'listening'
      },
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },

    watch: {
      express: {
        files:  ['server.js', 'app/index.html'],
        tasks:  ['build', 'express:dev'],
        options: {
          spawn: false
        }
      }
    }
  });
  grunt.registerTask('test', ['jshint', 'jscs', 'simplemocha']);
  grunt.registerTask('test:client', ['browserify:test', 'karma:unit']);
  grunt.registerTask('build:dev', ['clean:dev', 'browserify:dev', 'copy:dev',
    'sass:dev']);
  grunt.registerTask('serve', ['build:dev', 'express:dev', 'watch']);
  grunt.registerTask('default', ['build:dev', 'test', 'test:client']);

};
