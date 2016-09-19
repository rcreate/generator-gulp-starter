window['jQuery'] = require('jquery')
window['$'] = window['jQuery']
var $ = window['jQuery']
require('bootstrap/dist/js/umd/dropdown.js')
window['hljs'] = require('highlightjs/highlight.pack.js')
require('./styleguide/page/highlight.js')
require('./styleguide/page/toggle.js')

if (typeof window !== 'undefined') global = window;

var StyleguideIndex = {

    init: function() {

        this.$body = $('body');
        this.$breakpointsLinks = $('.huge-header__breakpoints__item__link');
        this.$iframe = $('.huge-iframe-wrapper iframe');

        this.events();
    },

    events: function() {
        var _this = this;

        this.$breakpointsLinks.click(function() {
            _this.resizeContent($(this));
        });
    },

    resizeContent: function($elem) {
        var sizeLabel = $elem.data('size-label'),
            size = sizeLabel === 'full' ? $elem.data('size') : parseInt($elem.data('size').replace('px', ''), 10);

        this.$iframe.width(size);
    }
};

$(window).on('load', function() {
    StyleguideIndex.init();
});