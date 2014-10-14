/*
 * Wysiwyg input for Jeditable
 *
 * Copyright (c) 2008 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 * 
 * Depends on jWYSIWYG plugin by Juan M Martinez:
 *   http://projects.bundleweb.com.ar/jWYSIWYG/
 *
 * Project home:
 *   http://www.appelsiini.net/projects/jeditable
 *
 * Revision: $Id$
 *
 */


$.editable.addInputType('wysiwyg', {
    /* Use default textarea instead of writing code here again. */
    //element : $.editable.types.textarea.element,
    element : function (settings, original) {
        // Called first, to build element.
        /* The commented-out method was meant to hide the textarea to avoid flicker.
        See https://github.com/tuupola/jquery_jeditable_wysiwyg/commit/3ded3c17027f2284385cc1a5e39be44963e63da2
        This disables the HTML button in the jWYSIWYG toolbar, however, so I removed it. */
        var textarea = $('<textarea>'); // .css("opacity", "0")
        if (settings.rows) {
            textarea.attr('rows', settings.rows);
        } else {
            textarea.height(settings.height);
        }
        if (settings.cols) {
            textarea.attr('cols', settings.cols);
        } else {
            textarea.width(settings.width);
        }
        textarea.attr('id', settings.name.replace('[', '_').replace(']', ''));
        $(this).append(textarea);
        return (textarea);
    },
    content : function (string, settings, original) {
        // Called second, to populate element.
        /* jWYSIWYG plugin uses .text() instead of .val()        */
        /* For some reason it did not work work with generated   */
        /* textareas so I am forcing the value here with .text() */
        $('textarea', this).text(string);
        // $('textarea', this).val(string);
    },
    plugin : function (settings, original) {
        // Called third.
        // console.log('Plugin function called.');
        var self = this;
        /* Force autosave off to avoid "element.contentWindow has no properties" */
        /* To have an ID on the iframe, we need to send an element.id. */
        settings.wysiwyg = $.extend({autoSave: false}, settings.wysiwyg);
        if (settings.wysiwyg) {
            setTimeout(function () { $('textarea', self).wysiwyg(settings.wysiwyg); }, 0);
        } else {
            setTimeout(function () { $('textarea', self).wysiwyg(); }, 0);
        }
    },
    submit : function (settings, original) {
        // console.log('Submit function called.');
        // This is messy. There are three values to track: new_content (what's in the WYSIWYG iframe)
        // and the textarea's val() and text() numbers. There's some weird logic below to try to 
        // guess which one should really be saved. It may not always be right.
        var iframe         = $("iframe", this).get(0);
        var inner_document = typeof (iframe.contentDocument) === 'undefined' ?  iframe.contentWindow.document.body : iframe.contentDocument.body;
        var new_content    = $(inner_document).html();
        var area_text = $('textarea', this).text();
        var area_val = $('textarea', this).val();
        if ((new_content !== area_val) && (area_val !== '<p>Initial content</p>') && (area_val !== area_text)) {
            // console.log('Saving HTML mode val().');
            area_val;
        } else {
            // console.log('Saving WYSIWYG mode: ' + new_content);
            $('textarea', this).val(new_content);
        }
    }
});
