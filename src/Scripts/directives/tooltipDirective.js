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
        // When the current tip disappears...
        var tipAnimate = $tooltip.stop().fadeOut().promise();

        // Show the next tip.
        tipAnimate.done(function() {
            var $wrapper = $tooltip.find('.tooltip-content');
            var content = $element.attr('data-tooltip');
            var tipRender;

            if (content[0] === '#') {
                // Display a copy of the specified element inside the tip.
                tipRender = $wrapper.empty().append($(content).clone()).promise();
            } else {
                // Display the specified text inside the tip.
                tipRender = $wrapper.text(content).promise();
            }

            // When tip re-renders after content change...
            tipRender.done(function() {
                // Move the tip to the new position.
                var tooltipWidth = $tooltip.width();
                var paddingLeft = parseInt($tooltip.css('padding-left'));

                var th = $tooltip.height();

                var y = Math.max(0,
                    $element.offset().top - th - 14 -
                    parseInt($element.attr('data-tooltip-offset-y') || 0));

                var desiredX = $element.offset().left + $element.width() / 2 -
                    tooltipWidth / 2 - paddingLeft -
                    parseInt($element.attr('data-tooltip-offset-x') || 0)

                var maxX = window.innerWidth - tooltipWidth - paddingLeft * 5;
                var x = Math.min(maxX, Math.max(paddingLeft, desiredX));

                if (x != desiredX) {
                    // If position has been limited, move tooltip point instead.
                    var pointLeft = tooltipWidth / 2 - (x - desiredX) + 1;
                    $tooltip.find('.tooltip-point').css({ left: pointLeft});
                } else {
                    $tooltip.find('.tooltip-point').attr('style', '');
                }

                $tooltip.css({
                    left: Math.floor(x),
                    top: Math.floor(y)
                }).fadeIn();
            });
        });
    } else {
        //$tooltip.stop().fadeOut();
    }
}