'use strict';

let path = require('path');

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
      <% if( enableTypescript ) { %>
      app: ['./app.ts'],
      <% } else { %>
      app: ['./app.js'],
      <% } %>
      <% if( cssPreprocessor === 'sass' && enableStyleguide === true ) { %>
      inject: ['./inject.js'],
      styleguide: ['./styleguide.js'],
      <% } %>
    },
    extensions: ['js', 'json'<% if( enableTypescript ) { %>,'ts'<% } %>],
    extractSharedJs: false,
    provide: {
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery'
    },
    babelLoader: {
      exclude: null,
      include: [
        path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.javascripts.src),
        path.resolve(process.env.PWD, 'node_modules/jquery/'),
        path.resolve(process.env.PWD, 'node_modules/jquery-ui/ui/'),
        path.resolve(process.env.PWD, 'node_modules/bootstrap'),
      ]
    },
    hotModuleReplacement: true,
    deployUncompressed: true
    <% if( enableTypescript ) { %>
    ,developmentLoaders: [
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' }
    ]
    ,devtool: 'source-map'
    <% } %>
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
      importer: require('npm-sass-require')
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
