var $ = require("jquery")

module.exports = function($target, options){
    "use strict";

    var self = this;

    this.init = function(){
        alert('works!')
    }

    $(function(){
        self.init()
    })
}
