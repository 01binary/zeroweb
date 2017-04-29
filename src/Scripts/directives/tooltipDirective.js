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

    var ret = $(div)
        .attr('id', 'tip')
        .addClass('tooltip')
        .hide()
        .appendTo($('body'));

    ret.append($('<span></span>').addClass('tooltip-content'));
    ret.append($(div).addClass('tooltip-point'))

    return ret;
}

/*
 * Show or hide the tooltip for an element.
 * @param {bool} show - Whether to show or hide the tooltip.
 * @param {object} $element - Element for which to show the tooltip.
 */
function showTooltip(show, $element) {
    var $tooltip = getTooltip();

    if (show) {
        // If the value as an element name starting with #,
        // should set that element as a child of self.
        var content = $element.attr('data-tooltip');
        var $wrapper = $tooltip.find('.tooltip-content');
        var paddingLeft = parseInt($tooltip.css('padding-left'));

        if (content[0] === '#') {
            $wrapper.empty().append($(content).clone());
        } else {
            $wrapper.text(content);
        }

        var y = Math.max(0,
            $element.offset().top -
            $tooltip.height() -
            14 -
            parseInt($element.attr('data-tooltip-offset-y') || 0));

        var xMax = window.width - $tooltip.width() - 1000;
        console.log(xMax);
        var x = Math.max(0,
            $element.offset().left +
            $element.width() / 2 -
            $tooltip.width() / 2 -
            paddingLeft -
            parseInt($element.attr('data-tooltip-offset-x') || 0));

        if (x > xMax) x = xMax;

        $tooltip.css({ left: x, top: y }).stop().fadeIn();
    } else {
        $tooltip.stop().fadeOut();
    }
}