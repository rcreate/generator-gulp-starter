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

      this.config.set({
          enableStaticFiles: false,
          enableAssetRevisioning: false
      });
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
                      name: 'Bootstrap 4 alpha4',
                      value: '4.0.0-alpha.4'
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
              default: '4.0.0-alpha.4'
          },
          {
              type: 'confirm',
              name: 'enableStyleguide',
              message: 'Do you want to add a Styleguide to your Project?',
              default: true
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
                      value: 'chrome'
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
                         this.config.set(answers)
                     }.bind(this)
                 );
  },

  writing: {
    packageJSON: function () {
        var answers = this.config.getAll();
        if (answers.bootstrapVersion.indexOf('4') === 0) {
            answers["bootstrapName"] = "bootstrap";
        } else if (answers.bootstrapVersion.indexOf('3') === 0) {
            answers["bootstrapName"] = "bootstrap" + ( answers.cssPreprocessor === 'less' ? '' : '-sass' );
        }

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            answers
        );
    },

    config: function () {
        mkdirp('build_tools');
        this.fs.copyTpl(
              this.templatePath('build_tools/_config.json'),
              this.destinationPath('build_tools/config.json'),
              this.config.getAll()
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

    eslint: function () {
        this.fs.copy(
            this.templatePath('_eslintrc.js'),
            this.destinationPath('.eslintrc.js')
        );
    },

    htaccess: function () {
        this.fs.copy(
            this.templatePath('_htaccess'),
            this.destinationPath('.htaccess')
        );
    },

    pug: function () {
        var answers = this.config.getAll();
        if (!answers.enablePug) {
            return;
        }

        mkdirp('src/pug/app');

        this.fs.copy(
            this.templatePath('src/pug') + '/*.*',
            this.destinationPath('src/pug')
        );

        this.fs.copy(
            this.templatePath('src/pug/app') + '/**/*.*',
            this.destinationPath('src/pug/app')
        );

        this.fs.copyTpl(
            this.templatePath('src/pug/app/atomic/template/base.pug'),
            this.destinationPath('src/pug/app/atomic/template/base.pug'),
            answers
        );

        if( answers.cssPreprocessor === 'sass' && answers.enableStyleguide === true ) {
            mkdirp('src/pug/styleguide');

            this.fs.copy(
                this.templatePath('src/pug/styleguide') + '/**/*.*',
                this.destinationPath('src/pug/styleguide')
            );
        }
    },

    javascript: function () {
        var answers = this.config.getAll();
        if (!answers.enableJavascript) {
            return;
        }

        mkdirp('loaders');

        if (answers.useBabel) {
            this.fs.copyTpl(
                this.templatePath('loaders/babel.js'),
                this.destinationPath('loaders/babel.js'),
                answers
            );
        } else {
            this.fs.copyTpl(
                this.templatePath('loaders/imports.js'),
                this.destinationPath('loaders/imports.js'),
                answers
            );
        }

        mkdirp('src/javascripts/app');

        this.fs.copy(
            this.templatePath('src/javascripts/app') + '/**/*.*',
            this.destinationPath('src/javascripts/app')
        );
        this.fs.copy(
            this.templatePath('src/javascripts/app.js'),
            this.destinationPath('src/javascripts/app.js')
        );

        if( answers.cssPreprocessor === 'sass' && answers.enableStyleguide === true ) {
            this.fs.copy(
                this.templatePath('src/javascripts/inject.js'),
                this.destinationPath('src/javascripts/inject.js')
            );
            this.fs.copy(
                this.templatePath('src/javascripts/styleguide.js'),
                this.destinationPath('src/javascripts/styleguide.js')
            );
        }
    },

    stylesheet: function () {
        var answers = this.config.getAll();
        if (!answers.enableStylesheet) {
            return;
        }

        var type = answers.cssPreprocessor;
        var ext = type;
        if (ext === "sass") {
            ext = "scss";
        }

        mkdirp('src/stylesheets/app');

        this.fs.copy(
            this.templatePath('src/' + type + '/app') + '/**/*.*',
            this.destinationPath('src/stylesheets/app')
        );
        this.fs.copy(
            this.templatePath('src/' + type + '/app.'+ext),
            this.destinationPath('src/stylesheets/app.'+ext)
        );

        if( answers.cssPreprocessor === 'sass' && answers.enableStyleguide === true ) {
            mkdirp('src/stylesheets/styleguide');

            this.fs.copy(
                this.templatePath('src/' + type + '/styleguide') + '/**/*.*',
                this.destinationPath('src/stylesheets/styleguide')
            );
            this.fs.copy(
                this.templatePath('src/' + type + '/inject.'+ext),
                this.destinationPath('src/stylesheets/inject.'+ext)
            );
            this.fs.copy(
                this.templatePath('src/' + type + '/styleguide.'+ext),
                this.destinationPath('src/stylesheets/styleguide.'+ext)
            );
        }

        this.fs.copyTpl(
            this.templatePath('src/' + type + '/app/config/_config.' + ext),
            this.destinationPath('src/stylesheets/app/config/_config.' + ext),
            answers
        );

        this.fs.copyTpl(
            this.templatePath('src/' + type + '/app/vendor/_vendor.' + ext),
            this.destinationPath('src/stylesheets/app/vendor/_vendor.' + ext),
            answers
        );

        var sourceFile;
        if (answers.bootstrapVersion.indexOf('4') === 0) {
            sourceFile = 'v' + answers.bootstrapVersion + '.' + ext;
        } else if (answers.bootstrapVersion.indexOf('3') === 0) {
            sourceFile = 'v3.' + ext;
        }

        if (sourceFile) {
            this.fs.copyTpl(
                this.templatePath('src/bootstrap/' + sourceFile),
                this.destinationPath('src/stylesheets/app/vendor/bootstrap.' + ext),
                answers
            );

            mkdirp('src/stylesheets/app/config/bootstrap');

            this.fs.copyTpl(
                this.templatePath('src/bootstrap/config/_bootstrap.' + ext),
                this.destinationPath('src/stylesheets/app/config/bootstrap/_bootstrap.' + ext),
                answers
            );
        }
    },

    images: function() {
        if( !this.config.getAll().enableImages ) {
            return;
        }

        mkdirp('src/images');
        this.fs.copy(
            this.templatePath('src/images') + '/**/*.*',
            this.destinationPath('src/images')
        );
    },

    fonts: function() {
        if( !this.config.getAll().enableFonts ) {
            return;
        }

        mkdirp('src/fonts');
        this.fs.copy(
            this.templatePath('src/fonts') + '/**/*.*',
            this.destinationPath('src/fonts')
        );
    },

    iconFont: function() {
        if( !this.config.getAll().enableIconFont ) {
            return;
        }

        mkdirp('src/icons');
        this.fs.copy(
            this.templatePath('src/icons') + '/**/*.*',
            this.destinationPath('src/icons')
        );
    },

    staticFiles: function() {
        if( !this.config.getAll().enableStaticFiles ) {
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
          skipInstall: this.options['skip-install'],
          bower: false
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
