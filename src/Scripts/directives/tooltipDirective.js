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

// Tooltip opacity.
var tipOpacity = 0.9;

// How long to poll for size changes until the tip can be positioned.
var pollTimeout = 100;

// How often to poll for size changes.
var pollInterval = 33;

// Poll interval timer.
var pollTimer;

// Last poll time.
var lastPoll;

// Last tooltip width.
var lastWidth;

// Last tooltip height.
var lastHeight;

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
                showTooltip(false, $element);
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

/*
 * Show or hide the tooltip for an element.
 * @param {bool} show - Whether to show or hide the tooltip.
 * @param {object} $element - Element for which to show the tooltip.
 */
function showTooltip(show, $element) {
    var $tooltip = getTooltip();

    if (pollTimer) {
        window.clearInterval(pollTimer);
    }

    if (show) {
        var $wrapper = $tooltip.find('.tooltip-content');
        var content = $element.attr('data-tooltip');

        if (content[0] === '#') {
            // Display a copy of the specified element inside the tip.
            $wrapper.empty().append($(content).clone())
        } else {
            // Display the specified text inside the tip.
            $wrapper.empty().append(
                '<span class="tooltip-content__decorator">// </span>' +
                content);
        }

        // Hide until layout update completes.
        $tooltip.css({ display: 'block', opacity: '0' });

        // Poll size to detect layout update completion.
        lastWidth = null;
        lastHeight = null;
        lastPoll = null;
        pollTimer = setInterval(
            updateTooltip, pollInterval, $element, $tooltip);
    } else {
        $tooltip.hide();
    }
}

/**
 * Poll for tooltip placement until the layout is complete.
 * @param {Object} $element - The target element jQuery.
 * @param {Object} $tooltip - The tooltip jQuery.
 */
function updateTooltip($element, $tooltip) {
    var time = new Date();
    var tooltipWidth = Math.round($tooltip.width());
    var tooltipHeight = Math.round($tooltip.height());
    var x, y;

    if (tooltipWidth != lastWidth || tooltipHeight != lastHeight) {
        lastPoll = time;
        lastWidth = tooltipWidth;
        lastHeight = tooltipHeight;

        var paddingLeft = parseInt($tooltip.css('padding-left'));
        var maxX = window.innerWidth - tooltipWidth - paddingLeft * 5;
        var desiredX = $element.offset().left + $element.width() / 2 -
            tooltipWidth / 2 - paddingLeft -
            parseInt($element.attr('data-tooltip-offset-x') || 0)
        var x = Math.min(maxX, Math.max(paddingLeft, desiredX));
        var y = Math.max(0,
            $element.offset().top - tooltipHeight - 14 -
            parseInt($element.attr('data-tooltip-offset-y') || 0));

        if (x != desiredX) {
            var pointLeft = Math.round(tooltipWidth / 2 - (x - desiredX) + 1);
            $tooltip.find('.tooltip-point').css({ left: pointLeft });
        } else {
            $tooltip.find('.tooltip-point').attr('style', '');
        }

        x = Math.round(x);
        y = Math.round(y);

        $tooltip.css({ left: x, top: y });

    } else if (lastPoll && (time - lastPoll) >= pollTimeout) {
        // Detected layout update completion.
        clearInterval(pollTimer);
        $tooltip.animate({ opacity: tipOpacity });
    }
}
