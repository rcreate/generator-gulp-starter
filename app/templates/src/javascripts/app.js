window['jQuery'] = require('jquery')
window['$'] = window['jQuery']

window['app'] = window.app || new function () {
    "use strict";

    var self = this,
        instances = {}

    this.init = function(){
        loadModule('example', 'body')
    }

    this.getInstance = function(name, selector) {
        return instances[name][selector.toString()]
    }

    this.getInstanceCollection = function(name) {
        return instances[name]
    }

    var loadModule = function (name, selector) {
        var $target = $(selector)
        if( $target.length ) {
            var module = require('./app/'+name)
            instances[name] = {}
            instances[name][selector.toString()] = new module($target)
        }
    }
}

window.app.init()