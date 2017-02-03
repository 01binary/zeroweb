/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that displays article date selector.
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
 
/**
 * Register date selector directive.
 */
angular.module('zeroApp')
    .directive('dateselector', [ '$q', '$http', '$compile', '$window', 'render2d', 'safeApply', dateSelectorDirective ]);

/**
 * Implement date selector directive.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $window - The Angular window service.
 * @param {object} $render2d - The rendering service.
 * @param {object} $safeApply - The safe apply service.
 */
function dateSelectorDirective($q, $http, $compile, $window, $render2d, $safeApply) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="date-selector" data-ng-class="{loading:isLoading}" data-ng-resize="resize()"></div>',
        scope: {},
        link: function($scope, $element, attributes) {
            initialize(
                $q,
                $http,
                $compile,
                $window,
                $render2d,
                $safeApply,
                $scope,
                $element);
        }
    };
}

/**
 * Initialize the date selector.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $window - The Angular window service.
 * @param {object} $render2d - The 2D rendering service.
 * @param {object} $safeApply - The safe apply service.
 * @param {object} $scope - The directive scope.
 * @param {object} $element - The directive element.
 */
function initialize($q, $http, $compile, $window, $render2d, $safeApply, $scope, $element) {
    // Set initial state.
    $scope.isLoading = true;
    $scope.isExpanded = true;
    $scope.isScrolling = false;
    $scope.timeline = {};
    $scope.summary = {};
    $scope.visiblePages = [];
    $scope.maxVisiblePages = 8;

    $scope.isSeparator = isSeparator;
    $scope.expandCollapse = expandCollapse.bind($element, $scope, $safeApply);
    $scope.nextPage = nextPage.bind($element, $scope);
    $scope.prevPage = prevPage.bind($element, $scope);
    $scope.selectPage = selectPage.bind($element, $scope);
    $scope.pageMouseOver = pageMouseOver.bind($element, $scope);
    $scope.pageMouseOut = pageMouseOut.bind($element, $scope);
    $scope.pageMouseDown = pageMouseDown.bind($element, $scope);
    $scope.pageMouseUp = pageMouseUp.bind($element, $scope);
    $scope.render = render.bind($element, $scope);

    // Load content.
    loadContent($q, $http, $scope).then(function() {
        // Create child elements.
        $element.append($(
            // Background rectangle.
            '<div class="date-selector-background"></div>' +

            // Embedded resources.
            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">' +
                '<linearGradient id="page-button-gradient" style="display:block" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="30">' +
                    '<stop offset="0" style="stop-color:rgb(249,249,249)"/>' +
                    '<stop offset="1" style="stop-color:rgb(235,235,235)"/>' +
                '</linearGradient>' +
                '<linearGradient id="page-button-gradient-hover" style="display:block" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="50">' +
                    '<stop offset="0" style="stop-color:rgb(255,255,255)"/>' +
                    '<stop offset="1" style="stop-color:rgb(249,249,249)"/>' +
                '</linearGradient>' +
                '<linearGradient id="page-button-gradient-pushed" style="display:block" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="30">' +
                    '<stop offset="0" style="stop-color:rgb(102,102,102)"/>' +
                    '<stop offset="1" style="stop-color:rgb(137,137,137)"/>' +
                '</linearGradient>' +
                '<symbol id="page-button-border">' +
                    '<polyline stroke="currentColor" points="2.9,25.5 8.5,19.9 8.5,1.5 33.5,1.5"/>' +
                    '<polyline points="33.5,2 33.5,19.1 27.1,25.5 1.8,25.5"/>' +
                '</symbol>' +
                '<symbol id="page-button-outline">' +
                    '<polygon points="27.5,26.5 34.5,19.5 34.5,0.5 7.5,0.5 7.5,19.5 0.5,26.5">' +
                '</symbol>' +
                '<symbol id="arrow-left">' +
                    '<path fill="currentColor" d="M0,3.5l3.1-3.1h1.5L2.1,3h8.8V4H2.1l2.5,2.5H3.1L0,3.5z"/>' +
                '</symbol>' +
                '<symbol id="arrow-right">' +
                    '<path fill="currentColor" d="M7.9,6.6H6.4L8.9,4H0.2V3h8.8L6.4,0.4h1.5L11,3.5L7.9,6.6z"/>' +
                '</symbol>' +
            '</svg>' +

            // Previous page button.
            '<button role="button" class="date-selector-scroll date-selector-scroll-left" data-primary data-ng-click="prevPage()">' +
                '<svg width="11" height="7" viewBox="0 0 11 7">' +
                    '<use xlink:href="#arrow-left"></use>' +
                '</svg>' +
            '</button>' +

            // Pages strip.
            '<div class="date-selector-pages">' + 
                // Page button.
                '<button role="button" class="date-selector-page noselect" ' +
                    'data-ng-repeat="page in visiblePages" ' +
                    'data-ng-class="{' +
                        '\'date-selector-page-separator\': isSeparator(page), ' +
                        '\'pushed\': page === currentPage ' +
                    '}">' +
                    '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-outline" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-border" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-border"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-border-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-border"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-background" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<div class="date-selector-page-overlay" ' +
                        'data-ng-mouseover="pageMouseOver($event)" ' +
                        'data-ng-mouseout="pageMouseOut($event)" ' +
                        'data-ng-mousedown="pageMouseDown($event)" ' +
                        'data-ng-mouseup="pageMouseUp($event)">' +
                        '<span class="date-selector-page-fallback">page</span>' +
                        '<div class="date-selector-page-label">' +
                            '{{page}}' +
                        '</div>' +
                    '</div>' +
                '</button>' +

                // Next page button.
                // (has to be inside pages container to follow last page button).
                '<button role="button" class="date-selector-scroll-right noselect">' +
                    '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-outline" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-border" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-border"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-border-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-border"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-background" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<div class="date-selector-page-overlay" ' +
                        'data-ng-mouseover="pageMouseOver($event)" ' +
                        'data-ng-mouseout="pageMouseOut($event)" ' +
                        'data-ng-mousedown="pageMouseDown($event)" ' +
                        'data-ng-mouseup="pageMouseUp($event)">' +
                        '<div class="date-selector-page-label">' +
                            '<svg class="date-selector-page-label date-selector-scroll-label" width="11" height="7" viewBox="0 0 11 7">' +
                                '<use xlink:href="#arrow-right"></use>' +
                            '</svg>' +
                        '</div>' +
                    '</div>' +
                '</button>' +
            '</div>' +

            // Expand/collapse heading.
            '<button class="date-selector-caption button-inline" data-ng-click="expandCollapse()" data-tooltip="// expand or collapse">' +
                '{{isExpanded === true ? "- by date" : "+"}}' +
            '</button>' +

            // Tag view.
            '<div class="date-selector-view">' +
            '</div>'
        ));

        var pages = Object.keys($scope.timeline);

        if (pages.length) {
            // Render tags.
            $scope.render();

            // Update the selected page.
            $scope.selectPage(pages[0]);
        }

        // Compile the template.
        $compile($element)($scope);
    });
}

/**
 * Expand or collapse the custom control.
 * @param {object} $scope - The directive scope.
 * @param {object} $safeApply - The safe apply service.
 */
function expandCollapse($scope, $safeApply) {
    var $element = this;

    if (!$scope.isExpanded) {
        $element.removeClass('collapsed');
    }

    this.find('.date-selector-background')
        .stop()
        .animate({
            opacity: $scope.isExpanded ? 0 : 1
        }, 'fast', function() {
            $safeApply($scope, function() {
                $scope.isExpanded = !$scope.isExpanded;

                if (!$scope.isExpanded) {
                    $element.addClass('collapsed');
                }
            });
        });
}

/**
 * Scroll to next page.
 * @param {object} $scope - The directive scope.
 */
function prevPage($scope) {
    var prevPage = parseInt($scope.currentPage, 10) - 1;

    if (prevPage < 1)
        return;

    $scope.selectPage(prevPage);
}

/**
 * Scroll to previous page.
 * @param {object} $scope - The directive scope.
 */
function nextPage($scope) {
    var nextPage = parseInt($scope.currentPage, 10) + 1;

    if (nextPage >= $scope.timeline.length)
        return;

    $scope.selectPage(nextPage);
}

/**
 * Begin continuous scrolling.
 * @param {object} $scope - The directive scope.
 */
function beginScroll($scope) {
    $scope.scrolling = true;
}

/**
 * Process continuous scrolling.
 * @param {object} $scope - The directive scope.
 */
function doScroll($scope) {

}

/**
 * Complete continuous scrolling.
 * @param {object} $scope - The directive scope.
 */
function endScroll($scope) {
    $scope.scrolling = false;
}

/**
 * Get page button from Angular event arguments.
 * @param {object} event - The Angular event arguments.
 */
function getPageButton(event) {
    var $button = $(event.target).parent();
    return (
        ($button.hasClass('date-selector-page') ||
        $button.hasClass('date-selector-scroll-right')) &&
        !$button.hasClass('date-selector-page-separator')) ?
        $button : null;
}

/**
 * Page button normal to hover transition.
 * @param {object} $scope - The directive scope.
 * @param {object} event - The Angular event arguments.
 */
function pageMouseOver($scope, event) {
    var $button = getPageButton(event);
    
    if ($button) {
        $button.find('.date-selector-page-hover').stop().fadeIn('fast');
    }
}

/**
 * Page button hover to normal transition.
 * @param {object} $scope - The directive scope.
 * @param {object} event - The Angular event arguments.
 */
function pageMouseOut($scope, event) {
    var $button = getPageButton(event);

    if ($button) {
        $button.find('.date-selector-page-hover').stop().fadeOut('fast');

        if ($button.hasClass('date-selector-scroll-right')) {
            $button.removeClass('pushed');
        }
    }
}

/**
 * Page or scroll button hover to pushed transition.
 * @param {object} $scope - The directive scope.
 * @param {object} event - The Angular event arguments.
 */
function pageMouseDown($scope, event) {
    var $button = getPageButton(event);

    if ($button) {
        if ($button.hasClass('date-selector-scroll-right')) {
            $button.addClass('pushed');
            $scope.nextPage();
        } else {
            $scope.selectPage($button.find('.date-selector-page-label').text());
        }
    }
}

/**
 * Page or scroll button hover to pushed transition.
 * @param {object} $scope - The directive scope.
 * @param {object} event - The Angular event arguments.
 */
function pageMouseUp($scope, event) {
    var $button = getPageButton(event);

    if ($button && $button.hasClass('date-selector-scroll-right')) {
        $button.removeClass('pushed');
    }
}

/**
 * Load custom control content.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $scope - The directive scope.
 */
function loadContent($q, $http, $scope) {
    // TODO: need AJAX endpoint.
    $scope.timeline = {
        "1": {
            "aug 1": {
                "engineering-robotics": 2,
                "engineering-software": 1
            },

            "aug 8": {
                "design-web": 2,
                "design-industrial": 1
            },

            "aug 15": {
                "design-web": 1,
                "design-industrial": 1,
                "design-cad": 1,
                "art-painting": 2
            },

            "aug 22": {
                "engineering-robotics": 1,
                "art-crafts": 1,
                "engineering-mechanical": 2,
                "design-web": 1
            }
        },

        "2": {
            "sep 5": {
                "engineering-software": 1
            },

            "sep 12": {
                "design-industrial": 1
            },

            "sep 19": {
                "engineering-electrical": 3,
                "art-painting": 1
            },

            "sep 26": {
                "art-music": 2,
                "engineering-electrical": 1
            }
        },

        "3": {
            "oct 3": {},

            "oct 10": {
                "design-web": 1
            },

            "oct 17": {},

            "oct 24": {
                "design-industrial": 1
            },

            "oct 31": {}
        },

        "4": {
            "nov 7": {
                "art-painting": 1,
                "design-web": 1
            },

            "nov 14": {
                "design-frontend": 1,
                "engineering-robotics": 3
            },

            "nov 21": {},

            "nov 28": {
                "it-sql": 1
            }
        },

        "5": {
            "dec 5": {
                "engineering-mechanical": 2
            },

            "dec 12": {},

            "dec 19": {
                "art-painting": 1
            },

            "dec 26": {}
        },

        "6": {
            "jan 2": {
                "engineering-robotics": 2,
                "art-music": 1,
                "design-web": 1
            },

            "jan 9": {
                "engineering-software": 2
            },

            "jan 16": {},

            "jan 23": {
                "engineering-software": 1
            }
        },

        "7": {
            "feb 1": {
                "engineering-robotics": 3,
                "design-web": 1,
                "engineering-mechanical": 2
            }
        },
        "8": {},
        "9": {},
        "10": {},
        "11": {},
        "12": {},
        "13": {},
        "14": {},
        "15": {},
        "16": {},
        "17": {},
        "18": {},
        "19": {},
        "20": {},
        "21": {},
        "22": {},
        "23": {},
        "24": {},
        "25": {},
        "26": {},
        "27": {},
        "28": {},
        "29": {},
        "30": {},
        "31": {},
        "32": {},
        "33": {},
        "34": {},
        "35": {},
        "36": {},
        "37": {},
        "38": {},
        "39": {},
        "40": {},
        "41": {},
        "42": {},
        "43": {},
        "44": {},
        "45": {},
        "46": {},
        "47": {},
        "48": {},
        "49": {},
    };

    $scope.max = 0;
    $scope.summary = Object.keys($scope.timeline).map(function(key) {
        var month = $scope.timeline[key];
        var weeks = Object.keys(month);
        var monthSummary = { tags: {}, weeks: {}, total: 0 };

        if (weeks.length) {
            // Calculate the month and week totals.
            for (var weekIndex in month) {
                var week = month[weekIndex];
                var weekSummary = monthSummary.weeks[weekIndex] = { tags: {}, total: 0};

                for (var tag in week) {
                    if (monthSummary.tags[tag])
                        monthSummary.tags[tag] += week[tag];
                    else
                        monthSummary.tags[tag] = week[tag];

                    if (weekSummary.tags[tag])
                        weekSummary.tags[tag] += week[tag];
                    else
                        weekSummary.tags[tag] = week[tag];

                    weekSummary.total += week[tag];
                    monthSummary.total += week[tag];

                    if (weekSummary.total > $scope.max)
                        $scope.max = weekSummary.total;
                }
            }

            // Calculate the month date range.
            var firstWeekMonthDay = weeks[0].split(' ');
            var lastWeekMonthDay = weeks[weeks.length - 1].split(' ');

            monthSummary.month = firstWeekMonthDay[0];

            if (firstWeekMonthDay[0] === lastWeekMonthDay[0]) {
                // Use "jan 2 - 10" for example if first and last week have same month.
                monthSummary.range = firstWeekMonthDay[0] + ' ' +
                    firstWeekMonthDay[1] + ' - ' +
                    lastWeekMonthDay[1];
            } else {
                // Use "jan 29 - feb 3" for example if first and last week have different months.
                monthSummary.range = weeks[0] + ' ' + weeks[weeks.length - 1];
            }
        }

        return monthSummary;
    });

    $scope.isLoading = false;

    return $q.when();
}

/**
 * Get the captions for visible page buttons.
 * @param {object} $element - jQuery of the directive element.
 * @param {object} $scope - The directive scope.
 * @returns - The array of visible pages to render.
 */
function getVisiblePages($element, $scope) {
    // Calculate page element sizes.
    var buttonWidth = 37;
    var stripWidth = $element.width() - 40;

    // Total number of reserved page button slots in 2-break view.
    var reservedPageCount = 4;

    // Calculate visible pages for 1- and 2-break views.
    var totalPages = Object.keys($scope.timeline).length;
    var totalVisiblePages = Math.round(stripWidth / buttonWidth);
    var maxVisiblePages = Math.min(totalPages, $scope.maxVisiblePages);
    var visiblePages = Math.min(maxVisiblePages, totalVisiblePages);
    var halfVisiblePages = Math.round(visiblePages / 2);
    var currentPage = parseInt($scope.currentPage);

    // Calculate visible pages for a 1-break view.
    var pagesBeforeBreak = halfVisiblePages;
    var pagesAfterBreak = maxVisiblePages - halfVisiblePages - 1;

    // Calculate visible pages for a 2-break view.
    var sectionPages = Math.max(1, visiblePages - reservedPageCount);
    var halfSectionPages = Math.round(sectionPages / 2);
    var firstPage = Math.floor((currentPage - sectionPages) / halfSectionPages) *
        halfSectionPages + pagesBeforeBreak - 1;
    
    // Allocate the visible page slots (including breaks).
    var pageNumbersArray = new Array(visiblePages);

    if (currentPage >= sectionPages && currentPage - 1 <= totalPages - pagesAfterBreak) {
        // Calculate page slots for a 2-break view.
        // <- 1 ... X X X X ... n ->
        pageNumbersArray[0] = "1";
        pageNumbersArray[1] = '...';

        for (var n = 0; n < sectionPages; n++) {
            pageNumbersArray[n + 2] = (n + firstPage).toString();
        }

        pageNumbersArray[visiblePages - 2] = '... ';
        pageNumbersArray[visiblePages - 1] = totalPages.toString();
    } else {
        // Calculate page slots for a 1-break view.
        // <- 1 2 3 4 ... n-2 n-1 n ->
        var pagesBeforeBreak = halfVisiblePages;
        var pagesAfterBreak = maxVisiblePages - halfVisiblePages - 1;

        pageNumbersArray[pagesBeforeBreak] = '...';

        for (var n = 0; n < pagesBeforeBreak; n++) {
            pageNumbersArray[n] = (n + 1).toString();

            if (n < pagesAfterBreak) {
                pageNumbersArray[n + pagesBeforeBreak + 1] = (totalPages - pagesAfterBreak + n + 1).toString();
            }
        }
    }

    return pageNumbersArray;
}

/**
 * Determine whether the page is a separator by its caption.
 * @param {string} page - The page caption.
 */
function isSeparator(page) {
    return page.indexOf('.') !== -1;
}

/**
 * Update necessary markup when changing the displayed page.
 * @param {object} $scope - The directive scope.
 * @param {string} page - The page number or caption to change to.
 */
function selectPage($scope, page) {
    $scope.currentPage = page.toString();
    $scope.visiblePages = getVisiblePages(this, $scope);
}

/**
 * Render tags.
 * @param {object} $scope - The directive scope.
 */
function render($scope) {
    var $view = this.find('.date-selector-view');
    var $wrapper = null;
    
    for (var month in $scope.summary) {
        var monthSummary = $scope.summary[month];
        var $bar = null;

        // TODO: remove the 2 magic numbers.

        $wrapper = $('<div class="tag-page"></div>')
            .css('left', $wrapper ? $wrapper.position().left + $wrapper.width() + 6 : 2)
            .append($('<div class="tag-page-footer"></div>')
                .text(monthSummary.month))
            .append($('<div class="tag-page-separator"></div>'))
            .appendTo($view);
        
        for (var week in monthSummary.weeks) {
            var weekSummary = monthSummary.weeks[week];
            var verticalOffset = 0;

            $bar = $('<div class="tag-bar"></div>')
                .css('left', $bar ? $bar.position().left + $bar.width() : 0)
                .appendTo($wrapper);

            for (var tag in weekSummary.tags) {
                var tagCount = weekSummary.tags[tag];

                verticalOffset += $('<div class="tag-block tag-' + tag + '"></div>')
                    .css('height', Math.round(tagCount / $scope.max * 100).toString() + '%')
                    .css('bottom', verticalOffset)
                    .appendTo($bar)
                    .height() + (verticalOffset ? 0 : 2);
            }
        }
    }
}