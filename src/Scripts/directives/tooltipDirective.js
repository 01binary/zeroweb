/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that shows custom tooltips.
|  @requires ../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/**
 * Register tooltip directive.
 */
angular.module('zeroApp')
    .directive('tooltip', tooltipDirective);

/**
 * Implement tooltip directive.
 */
function tooltipDirective() {
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, $element, attributes) {

            $element.mouseenter(function() {
                showTooltip(true, $element);
            });

            $element.mouseleave(function() {
                showTooltip(false);
            });
        }
    };
}

/*
 * Get or create tooltip.
 * @returns {object} The tooltip element jQuery.
 */
function getTooltip() {
    var $tooltip = $('#tip');

    if ($tooltip.length === 0) {
        return createTooltip();
    }

    return $tooltip;
}

/*
 * Create a tooltip.
 * @returns {object} The new tooltip element jQuery.
 */
function createTooltip() {
    var div = '<div></div>';

    return $(div)
        .attr('id', 'tip')
        .addClass('tooltip')
        .hide()
        .appendTo($('body'));
}

/*
 * Show or hide the tooltip for an element.
 * @param {bool} show - Whether to show or hide the tooltip.
 * @param {object} $element - Element for which to show the tooltip.
 */
function showTooltip(show, $element) {
    var $tooltip = getTooltip();

    if (show) {
        $tooltip.text($element.attr('data-tooltip'));

        var arrowSize = parseInt(window.getComputedStyle($tooltip.get(0), ':after')
            .getPropertyValue('border-width'));

        var y = Math.max(0,
            $element.offset().top -
            $tooltip.height() -
            arrowSize * 2 -
            parseInt($element.css('padding-top'), 10) * 5);

        var x = Math.max(0,
            $element.offset().left +
            $element.width() / 2 -
            $tooltip.width() / 2 -
            parseInt($tooltip.css('padding-left') || 0));

        $tooltip.css({ left: x, top: y }).stop().fadeIn();
    } else {
        $tooltip.stop().fadeOut();
    }
}