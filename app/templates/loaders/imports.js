var path = require('path')

module.exports = function() {
    return { test: /\.js$/, loader: 'imports?define=>false'}
}
