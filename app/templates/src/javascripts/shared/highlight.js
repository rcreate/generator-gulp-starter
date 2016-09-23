'use strict';

function copyToClipboard(content) {
    var $temp = $('<textarea>');
    $('body').append($temp);
    $temp.val(content).select();
    document.execCommand('copy');
    $temp.remove();
}

$('pre code').each(function () {
    var html = $(this).html();
    html = html.replace(/^\r?\n/g, '');
    var spaces = html.match(/^[ ]*/);
    html = html.replace(new RegExp('^' + spaces), '');
    html = html.replace(new RegExp('\n' + spaces, 'g'), '\n');
    $(this).text(html);
    hljs.highlightBlock($(this).get(0));
    $(this).dblclick(function () {
        copyToClipboard(html);
        var shot = $('<div style="position:absolute; z-index:999; top: 0; width: 100%; height: 100%; background-color: #ffffff;"></div>');
        $(this).closest('.toggle-container').append(shot);
        shot.fadeOut(200, function () {
            $(this).remove();
        });
    });
});
