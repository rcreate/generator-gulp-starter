var path = require('path')
var config = require('../config')

module.exports = function(webpack) {
    return {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(config.root.src, config.tasks.js.src),
        query: {
            "presets": ["es2015", "stage-1"],
            "plugins": []
        }
    };
}
