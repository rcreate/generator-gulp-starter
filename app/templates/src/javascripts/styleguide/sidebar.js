'use strict';

module.exports = function($target){
    var init = function(){
        $target.on('click', toggle);
    };

    var toggle = function() {
        var $targetContainer = $( $(this).data('target') );
        $targetContainer.toggleClass('open');
        var expanded = ($targetContainer.hasClass('open'));
        $(this).attr('aria-expanded', (expanded?'true':'false'));
    };

    $(init)
};
