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
        scope: {
            sizePollingTimeout: 5000
        },
        link: function($scope, $element, attributes) {
            $element.mouseenter(function() {
                showTooltip.call($scope, true, $element);
            });

            $element.mouseleave(function() {
                showTooltip.call($scope, true, $element);
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

    ret.append($('<div></div>').addClass('tooltip-content'));
    ret.append($(div).addClass('tooltip-point'))

    return ret;
}

/**
 * Poll for tooltip placement until the layout is complete.
 * @param {Object} $element - The target element jQuery.
 * @param {Object} $tooltip - The tooltip jQuery.
 */
function updateTooltip($element, $tooltip) {
    var time = new DateTime();
    var tooltipWidth = Math.round($tooltip.width());
    var tooltipHeight = Math.round($tooltip.height());

    if (tooltipWidth != this.lastWidth || tooltipHeight != this.lastHeight) {
        var paddingLeft = parseInt($tooltip.css('padding-left'));

        var y = Math.max(0,
            $element.offset().top - tooltipHeight - 14 -
            parseInt($element.attr('data-tooltip-offset-y') || 0));

        var desiredX = $element.offset().left + $element.width() / 2 -
            tooltipWidth / 2 - paddingLeft -
            parseInt($element.attr('data-tooltip-offset-x') || 0)

        var maxX = window.innerWidth - tooltipWidth - paddingLeft * 5;
        var x = Math.min(maxX, Math.max(paddingLeft, desiredX));

        if (x != desiredX) {
            // If position has been limited, move tooltip point instead.
            var pointLeft = Math.round(tooltipWidth / 2 - (x - desiredX) + 1);
            $tooltip.find('.tooltip-point').css({ left: pointLeft });
        } else {
            $tooltip.find('.tooltip-point').attr('style', '');
        }

        x = Math.round(x);
        y = Math.round(y);

        this.lastSizeCheck = time;
        this.lastWidth = tooltipWidth;
        this.lastHeight = tooltipHeight;

    } else if ((time - this.lastSizeCheck) <= sizePollingTimeout) {
        window.clearInterval(this.updateTimer);
        $tooltip.css({ left: x, top: y }).stop().fadeIn();
    }
}

/*
 * Show or hide the tooltip for an element.
 * @param {bool} show - Whether to show or hide the tooltip.
 * @param {object} $element - Element for which to show the tooltip.
 */
function showTooltip(show, $element) {
    var $tooltip = getTooltip();

    if (show) {
        $tooltip.stop().fadeOut(function() {
            var $wrapper = $tooltip.find('.tooltip-content');
            var content = $element.attr('data-tooltip');

            if (content[0] === '#') {
                // Display a copy of the specified element inside the tip.
                $wrapper.empty().append($(content).clone())
            } else {
                // Display the specified text inside the tip.
                tipRender = $wrapper.text(content);
            }

            this.updateTimer = window.setInterval(
                updateTooltip.apply(this, $element, $tooltip), 100);
        });
    } else {
        $tooltip.stop().fadeOut();
    }
}