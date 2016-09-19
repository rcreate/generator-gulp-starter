'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    this.destinationRoot('../')
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var prompts = [
      {
        type: 'input',
        name: 'appName',
        message: 'Title of your frontend prototype'
      },
      {
        type: 'input',
        name: 'appDescription',
        message: 'Description of the repository'
      },
      {
        type: 'input',
        name: 'repositoryName',
        message: 'Name of the repository',
        default: 'company-20xx-frontend'
      },
      {
        type: 'input',
        name: 'appAuthorName',
        message: 'Name of the author'
      },
      {
        type: 'input',
        name: 'appAuthorEmail',
        message: 'Email of the author'
      },
      {
        type: 'input',
        name: 'urlWiki',
        message: 'URL of the wiki page'
      },
      {
        type: 'input',
        name: 'urlJira',
        message: 'URL of the Jira project'
      },
      {
        type: 'radio',
        name: 'cssPreprocessor',
        message: 'Which css preprocessor do you want to use?',
        choices: [
          {
            name: 'Sass',
            value: 'sass',
            checked: true
          },
          {
            name: 'Less',
            value: 'less'
          }
        ]
      },
      {
        type: 'radio',
        name: 'bootstrap',
        message: 'Which version of Bootstrap do you want to use?',
        choices: [
          {
            name: 'Bootstrap 4 alpha3 (experimental)',
            value: 'bs4.3'
          },
          {
            name: 'Bootstrap 4 alpha2',
            value: 'bs4.2',
            checked: true
          },
          {
            name: 'Bootstrap 3 latest',
            value: 'bs3'
          },
          {
            name: 'none',
            value: 'none'
          }
        ]
      }
    ];

    return this.prompt(prompts).then(function (answers) {
      this.cssPreprocessor = answers.cssPreprocessor;
      this.bootstrap = answers.bootstrap;
    }.bind(this));
  },

  writing: {
    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          cssPreprocessor: this.cssPreprocessor,
          bootstrap: this.bootstrap
        }
      );
    },

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore'));
    },

    editorConfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    structure: function () {
      mkdirp('src/fonts');
      mkdirp('src/icons');
      mkdirp('src/images');
    },

    pug: function () {
      mkdirp('src/pug');

      this.fs.directory(
        this.templatePath('src/pug'),
        this.destinationPath('src/pug'));

      this.fs.copy(
        this.templatePath('src/pug/atomic/template/base.pug'),
        this.destinationPath('src/pug/atomic/template/base.pug')
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
    var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
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
