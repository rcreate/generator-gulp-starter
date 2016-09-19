var path = require('path')
var config = require('../config')

module.exports = function(webpack) {
    return { test: /\.js$/, loader: 'imports?define=>false'}
}
