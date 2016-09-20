'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var extend = require('node.extend');

module.exports = generators.Base.extend({
  constructor: function () {
      generators.Base.apply(this, arguments);

      this.option('skip-welcome-message', {
          desc: 'Skips the welcome message',
          type: Boolean
      });

      this.option('skip-install', {
          desc: 'Skips the installation of dependencies',
          type: Boolean
      });

      this.option('skip-install-message', {
          desc: 'Skips the message after the installation of dependencies',
          type: Boolean
      });

      this.answers = {
          enableStaticFiles: false,
          enableAssetRevisioning: false
      };
  },

  initializing: function () {
      this.pkg = require('../package.json');
  },

  prompting: function () {
      if (!this.options['skip-welcome-message']) {
          this.log(yosay('This is a starter package for your Web application. Please provide as much information about your project as you can. Your project will be available after installing all dependencies.'));
      }

      var prompts = [
          {
              type: 'input',
              name: 'appName',
              message: 'Title of your frontend prototype:'
          },
          {
              type: 'input',
              name: 'appDescription',
              message: 'Description of the repository:'
          },
          {
              type: 'input',
              name: 'repositoryName',
              message: 'Name of the repository:',
              default: 'company-20xx-frontend'
          },
          {
              type: 'input',
              name: 'appAuthorName',
              message: 'Name of the author:'
          },
          {
              type: 'input',
              name: 'appAuthorEmail',
              message: 'Email of the author:'
          },
          {
              type: 'input',
              name: 'urlWiki',
              message: 'URL of the wiki page:'
          },
          {
              type: 'input',
              name: 'urlJira',
              message: 'URL of the Jira project:'
          },
          {
              type: 'confirm',
              name: 'enablePug',
              message: 'Enable "Pug" template renderer? Do not enable if you only wnat to process CSS and JS.',
              default: true
          },
          {
              type: 'confirm',
              name: 'enableJavascript',
              message: 'Enable Javascript processing?',
              default: true
          },
          {
              type: 'confirm',
              name: 'useBabel',
              message: 'Use ECMAScript6 compilation for Javascript sources?',
              default: true
          },
          {
              type: 'confirm',
              name: 'enableStylesheet',
              message: 'Enable Stylesheet processing?',
              default: true
          },
          {
              type: 'list',
              name: 'cssPreprocessor',
              message: 'Which CSS preprocessor do you want to use?',
              choices: [
                  {
                      name: 'Sass',
                      value: 'sass'
                  },
                  {
                      name: 'Less (not supported in Bootstrap 4)',
                      value: 'less'
                  }
              ],
              default: 'sass'
          },
          {
              type: 'list',
              name: 'bootstrapVersion',
              message: 'Which version of Bootstrap do you want to use?',
              choices: [
                  {
                      name: 'Bootstrap 4 alpha3 (experimental)',
                      value: '4.0.0-alpha.3'
                  },
                  {
                      name: 'Bootstrap 4 alpha2 (tested)',
                      value: '4.0.0-alpha.2'
                  },
                  {
                      name: 'Bootstrap 3 latest',
                      value: '3.3.7'
                  },
                  {
                      name: 'none',
                      value: false
                  }
              ],
              default: '4.0.0-alpha.2'
          },
          {
              type: 'confirm',
              name: 'cssAutoprefixer',
              message: 'Do you want to enable auto prefixing of your css rules?',
              default: true
          },
          {
              type: 'confirm',
              name: 'enableImages',
              message: 'Do you want to copy your images automatically to the target directory?',
              default: true
          },
          {
              type: 'confirm',
              name: 'enableFonts',
              message: 'Do you want to copy your fonts automatically to the target directory?',
              default: true
          },
          {
              type: 'confirm',
              name: 'enableIconFont',
              message: 'Do you want generate a icon font by combining all SVG files in your "src/icons" directory?',
              default: false
          },
          {
              type: 'confirm',
              name: 'watch',
              message: 'Do you want to have a watch task enabled?',
              default: true
          },
          {
              type: 'confirm',
              name: 'browserSync',
              message: 'Do you want to enable browserSync?',
              default: true
          },
          {
              type: 'confirm',
              name: 'devServer',
              message: 'Do you want to start a development server for your project?',
              default: true
          },
          {
              type: 'confirm',
              name: 'devBrowserOpen',
              message: 'Do you want to automatically open your browser when development task has finished?',
              default: true
          },
          {
              type: 'list',
              name: 'devBrowser',
              message: 'Which browser do you want to open?',
              choices: [
                  {
                      name: 'Your default browser',
                      value: "default"
                  },
                  {
                      name: 'Chrome',
                      value: 'google chrome'
                  },
                  {
                      name: 'Firefox',
                      value: 'firefox'
                  },
                  {
                      name: 'Safari',
                      value: 'safari'
                  }
              ]
          }
      ];

      return this.prompt(prompts)
                 .then(
                     function (answers) {
                         extend(this.answers, answers);
                     }.bind(this)
                 );
  },

  writing: {
    packageJSON: function () {
        var answers = this.answers;
        if (this.answers.bootstrapVersion.indexOf('4') === 0) {
            answers["bootstrapName"] = "bootstrap";
        } else if (this.answers.bootstrapVersion.indexOf('3') === 0) {
            answers["bootstrapName"] = "bootstrap" + ( this.answers.cssPreprocessor === 'less' ? '' : '-sass' );
        }

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            answers
        );
    },

    config: function () {
        this.fs.copyTpl(
              this.templatePath('_config.json'),
              this.destinationPath('config.json'),
              this.answers
        );
    },

    git: function () {
        this.fs.copy(
            this.templatePath('gitignore'),
            this.destinationPath('.gitignore')
        );
    },

    editorConfig: function () {
        this.fs.copy(
            this.templatePath('editorconfig'),
            this.destinationPath('.editorconfig')
        );
    },

    pug: function () {
        if (!this.answers.enablePug) {
            return;
        }

        mkdirp('src/pug');

        this.fs.copy(
            this.templatePath('src/pug') + '/**/*.*',
            this.destinationPath('src/pug')
        );

        this.fs.copyTpl(
            this.templatePath('src/pug/atomic/template/base.pug'),
            this.destinationPath('src/pug/atomic/template/base.pug'),
            this.answers
        );
    },

    javascript: function () {
        if (!this.answers.enableJavascript) {
            return;
        }

        mkdirp('loaders');

        if (this.answers.useBabel) {
            this.fs.copyTpl(
                this.templatePath('loaders/babel.js'),
                this.destinationPath('loaders/babel.js'),
                this.answers
            );
        } else {
            this.fs.copyTpl(
                this.templatePath('loaders/imports.js'),
                this.destinationPath('loaders/imports.js'),
                this.answers
            );
        }

        mkdirp('src/javascripts');

        this.fs.copy(
            this.templatePath('src/javascripts') + '/**/*.*',
            this.destinationPath('src/javascripts')
        );
    },

    stylesheet: function () {
        if (!this.answers.enableStylesheet) {
            return;
        }

        var type = this.answers.cssPreprocessor;
        var ext = type;
        if (ext === "sass") {
            ext = "scss";
        }

        mkdirp('src/stylesheets');

        this.fs.copy(
            this.templatePath('src/' + type) + '/**/*.*',
            this.destinationPath('src/stylesheets')
        );

        this.fs.copyTpl(
            this.templatePath('src/' + type + '/config/_config.' + ext),
            this.destinationPath('src/stylesheets/config/_config.' + ext),
            this.answers
        );

        this.fs.copyTpl(
            this.templatePath('src/' + type + '/vendor-styles/_vendor-styles.' + ext),
            this.destinationPath('src/stylesheets/vendor-styles/_vendor-styles.' + ext),
            this.answers
        );

        var sourceFile;
        if (this.answers.bootstrapVersion.indexOf('4') === 0) {
            sourceFile = 'v' + this.answers.bootstrapVersion + '.' + ext;
        } else if (this.answers.bootstrapVersion.indexOf('3') === 0) {
            sourceFile = 'v3.' + ext;
        }

        if (sourceFile) {
            this.fs.copyTpl(
                this.templatePath('src/bootstrap/' + sourceFile),
                this.destinationPath('src/stylesheets/vendor-styles/bootstrap.' + ext),
                this.answers
            );

            mkdirp('src/stylesheets/config/bootstrap');

            this.fs.copyTpl(
                this.templatePath('src/bootstrap/config/_bootstrap.' + ext),
                this.destinationPath('src/stylesheets/config/bootstrap/_bootstrap.' + ext),
                this.answers
            );
        }
    },

    images: function() {
        if( !this.answers.enableImages ) {
            return;
        }

        mkdirp('src/images');
        this.fs.copy(
            this.templatePath('src/images') + '/**/*.*',
            this.destinationPath('src/images')
        );
    },

    fonts: function() {
        if( !this.answers.enableFonts ) {
            return;
        }

        mkdirp('src/fonts');
        this.fs.copy(
            this.templatePath('src/fonts') + '/**/*.*',
            this.destinationPath('src/fonts')
        );
    },

    iconFont: function() {
        if( !this.answers.enableIconFont ) {
            return;
        }

        mkdirp('src/icons');
        this.fs.copy(
            this.templatePath('src/icons') + '/**/*.*',
            this.destinationPath('src/icons')
        );
    },

    staticFiles: function() {
        if( !this.answers.enableStaticFiles ) {
            return;
        }

        mkdirp('src/static');
        this.fs.copy(
            this.templatePath('src/static') + '/**/*.*',
            this.destinationPath('src/static')
        );
    }
  },

  install: function () {
      this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          skipInstall: this.options['skip-install']
      });
  },

  end: function () {
      var howToInstall =
              '\nRun ' +
              chalk.yellow.bold('npm install') +
              ' to get your app running.';

      if (this.options['skip-install']) {
          this.log(howToInstall);
          return;
      }

      this.log(
          "To run your generated application execute " +
          chalk.yellow.bold('npm run development') +
          "."
      );
  }
});
