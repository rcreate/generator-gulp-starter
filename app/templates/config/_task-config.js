'use strict';

var importer = require('npm-sass-require');

module.exports = {
  options: {
    cleanFirst: false,
    reportSizes: false,
    watch: <%= ( watch ? "true" : "false" ) %>
  },

  <% if( browserSync ) { %>
  browserSync: {
    <% if( devServer ) { %>
      <% if( devBrowserOpen ) { %>
        browser: '<%= devBrowser %>',
      <% } else { %>
        open: false,
      <% } %>
    server: {
      baseDir: 'dist'
    },
    <% } %>
  },
  <% } %>

  <% if( enableJavascript ) { %>
  javascripts: {
    entries: {
      app: ['./app.js'],
      <% if( cssPreprocessor === 'sass' && enableStyleguide === true ) { %>
      inject: ['./inject.js'],
      styleguide: ['./styleguide.js'],
      <% } %>
    },
    extensions: ['js', 'json'],
    extractSharedJs: false,
    hotModuleReplacement: true,
    deployUncompressed: true
  },
  <% } %>

  <% if( enableStylesheet ) { %>
  stylesheets: {
    <% if( cssAutoprefixer ) { %>
    autoprefixer: {
        browsers: ['last 3 version']
    },
    <% } %>
    <% if( cssPreprocessor === "sass" ) { %>
    type: 'sass',
    sass: {
      indentedSyntax: false,
      importer: importer
    },
    extensions: ['scss', 'sass'],
    <% } else { %>
      type: 'less',
      extensions: 'less',
    <% } %>
    excludeFolders: ['app'<% if( cssPreprocessor === "sass" && enableStyleguide === true ) { %>, 'inject', 'styleguide'<% } %>],
    deployUncompressed: true
  },
  <% } %>

  <% if( enablePug ) { %>
  pug: {
    getData: function() {
      var _ = require('lodash');
      var path = require('path');
      var fs = require('fs');

      var files = [ 'app/data/global.json'<% if( cssPreprocessor === "sass" && enableStyleguide === true ) { %>, 'styleguide/data/global.json'<% } %> ];
      var data = {};
      for( var i in files ) {
        var jsonPath = path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.pug.src, files[i]);
        var jsonData = JSON.parse(fs.readFileSync(jsonPath));
        data = _.assign(data, jsonData);
      }

      data['packageJson'] = JSON.parse(fs.readFileSync(path.resolve(process.env.PWD, 'package.json')));

      return data;
    },
    htmlmin: {},
    options: {},
    extensions: ['pug', 'json'],
    excludeFolders: ['atomic', 'helper', 'data']
  },
  <% } %>

  <% if( enableImages ) { %>
  images: {
    extensions: '*'
  },
  <% } %>

  <% if( enableFonts ) { %>
  fonts: {
    extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg']
  },
  <% } %>

  <% if( enableStaticFiles ) { %>
  static: {
      extensions: '*'
  },
  <% } %>
};
