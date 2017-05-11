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
var tipOpacity = 0.95;

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
        // Hide until layout update completes.
        $tooltip.stop().css({ display: 'block', opacity: '0' });

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

        // Poll size to detect layout update completion.
        lastWidth = null;
        lastHeight = null;
        lastPoll = null;
        pollTimer = setInterval(
            updateTooltip, pollInterval, $element, $tooltip);
    } else {
        $tooltip.stop().fadeOut();
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

        var $point = $tooltip.find('.tooltip-point');
        var pointSize = parseInt($point.css('border-left-width') || 0, 10);
        var paddingLeft = parseInt($tooltip.css('padding-left'), 10);
        var minY = window.scrollY || window.pageYOffset;
        var offsetX = parseInt($element.attr('data-tooltip-offset-left') || 0, 10);
        var desiredX = $element.offset().left + $element.width() / 2 -
            tooltipWidth / 2 - paddingLeft - offsetX;

        var x = Math.min(window.innerWidth - tooltipWidth - pointSize,
            Math.max(paddingLeft, desiredX));
        var y = Math.max(0,
            $element.offset().top - tooltipHeight -
            pointSize * 2 -
            parseInt($element.attr('data-tooltip-offset-top') || 0));

        // Display tooltip on the bottom if not enough space at the top.
        if (y < minY) {
            y = $element.offset().top + $element.height() + pointSize +
                parseInt($element.attr('data-tooltip-offset-bottom') || 0, 10);
            $point.addClass('tooltip-point--reverse');
        } else {
            $point.removeClass('tooltip-point--reverse');
        }

        // Move tooltip point to target center if tooltip couldn't be centered.
        if (x != desiredX) {
            $point.css({ left: Math.round(tooltipWidth / 2 - (x - desiredX) + 1) + 'px' });
        } else {
            $point.attr('style', '');
        }

        // Ensure position is rounded to prevent artifacts on low-dpi screens.
        $tooltip.css({
            left: Math.round(x) + 'px',
            top: Math.round(y) + 'px'
        });

    } else if (lastPoll && (time - lastPoll) >= pollTimeout) {
        clearInterval(pollTimer);
        $tooltip.animate({ opacity: tipOpacity });
    }
}
