var sgToggle = {
    init: function () {
        "use strict";

        $('[data-toggle=toggle]')
            .click(function () {
                $(this)
                    .next().slideToggle("fast")
                    .parent().toggleClass('open');
            })
            .nextAll().hide()
            .parent().toggleClass('open');
    }
};

$(function(){
    sgToggle.init();
});
