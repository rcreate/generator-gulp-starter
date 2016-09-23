'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var extend = require('node.extend');
var targetType = 'atom';

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        this.answers = {};
    },

    initializing: function () {
        this.conflicter.force = true;
    },

    prompting: function () {
        var prompts = [
            {
                type: 'input',
                name: 'id',
                message: 'Identifier (filename) of your new '+targetType+':'
            },
            {
                type: 'confirm',
                name: 'css',
                message: 'Do you want to add a stylesheet file?'
            }
        ];

        return this.prompt(prompts)
                   .then(
                       function (answers) {
                           answers.id = answers.id.replace(/[^a-z0-9\-_]/ig, '');

                           this.answers = extend(this.answers, answers);

                           var configFragment = {};
                           configFragment[targetType] = {};
                           configFragment[targetType][answers.id] = this.answers;

                           this.config.set(
                               extend(true, {}, this.config.getAll(), configFragment)
                           )
                       }.bind(this)
                   );
    },

    writing: {
        pug: function () {
            if( !this.config.getAll().enablePug ) {
                return;
            }

            var destinationPath = this.destinationPath( 'src/pug/app/atomic/' + targetType );

            this.fs.copyTpl(
                this.templatePath('tpl.pug'),
                destinationPath + '/' + this.answers.id + '.pug',
                this.answers
            );

            var importsPath = destinationPath + '/_' + targetType + '.pug';
            var imports = this.fs.read(importsPath, {defaults: ''});
            imports += 'include '+this.answers.id+'\n';
            this.fs.write(importsPath, imports);
        },

        css: function() {
            var globalConfig = this.config.getAll();
            if( globalConfig.enableStylesheet && this.answers.css === true ) {
                var destinationPath = this.destinationPath( 'src/stylesheets/app/atomic/' + targetType );
                var ext = globalConfig.cssPreprocessor;
                if (ext === "sass") {
                    ext = "scss";
                }

                this.fs.copyTpl(
                    this.templatePath('tpl.scss'),
                    destinationPath + '/' + this.answers.id + '.' + ext,
                    this.answers
                );

                var importsPath = destinationPath + '/_' + targetType + '.' + ext;
                var imports = this.fs.read(importsPath, {defaults: ''});
                imports += '@import "'+this.answers.id+'";\n';
                this.fs.write(importsPath, imports);
            }
        }
    }
});
