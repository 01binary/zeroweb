/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Factory that resizes textarea as lines are added.
|  @requires ../../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

/**
 * Register input resize factory.
 */
angular.module('zeroApp')
    .factory('inputResize', inputResizeFactory);

/**
 * Implement input resize factory.
 */
function inputResizeFactory() {
    return function(name) {
        var $element = $(name);
        var $parent = $element.parent();
        var $resizer = $('<div class="form-input-resizer">&nbsp;</div>')
            .appendTo($parent);

        $element.height($resizer.height());

        $element.on('change keyup paste', function() {
            var previewHtml = $(this).val().replace(/\n/g, '<br/>&nbsp;');
            $resizer.html(previewHtml);
            $element.height($resizer.height());
        });
    }
}