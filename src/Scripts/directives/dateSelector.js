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
    .directive('dateselector', [ '$q', '$http', '$compile', 'render2d', 'safeApply', dateSelectorDirective ]);

/**
 * Implement date selector directive.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $render2d - The rendering service.
 * @param {object} $safeApply - The safe apply service.
 */
function dateSelectorDirective($q, $http, $compile, $render2d, $safeApply) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="date-selector" data-ng-class="{loading:isLoading}" data-ng-resize="resize()"></div>',
        scope: {},
        link: function($scope, $element, attributes) {
            initialize($q, $http, $compile, $render2d, $safeApply, $scope, $element);
        }
    };
}

/**
 * Initialize date selector.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $render2d - The 2D rendering service.
 * @param {object} $safeApply - The safe apply service.
 * @param {object} $scope - The directive scope.
 * @param {object} $element - The directive element.
 */
function initialize($q, $http, $compile, $render2d, $safeApply, $scope, $element) {
    // Set initial state.
    $scope.isLoading = true;
    $scope.isExpanded = true;
    $scope.isScrolling = false;
    $scope.timeline = {};
    $scope.summary = {};
    $scope.visiblePages = [];
    $scope.maxVisiblePages = 8;
    $scope.margin = 10;
    $scope.pagesHeight = 32;
    $scope.currentPage = "1";

    $scope.isSeparator = isSeparator;
    $scope.expandCollapse = expandCollapse.bind($element, $scope, $safeApply);
    $scope.nextPage = nextPage.bind($element, $scope);
    $scope.prevPage = prevPage.bind($element, $scope);
    $scope.pageMouseOver = pageMouseOver.bind($element, $scope);
    $scope.pageMouseOut = pageMouseOut.bind($element, $scope);
    $scope.pageMouseDown = pageMouseDown.bind($element, $scope);
    $scope.pageMouseUp = pageMouseUp.bind($element, $scope);
    $scope.resize = resize.bind($element, $scope, $render2d);
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
                    '<polyline class="date-selector-page-highlight" points="2.9,25.5 8.5,19.9 8.5,1.5 33.5,1.5"/>' +
                    '<polyline class="date-selector-page-shadow" points="33.5,2 33.5,19.1 27.1,25.5 1.8,25.5"/>' +
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
            '<button class="date-selector-scroll date-selector-scroll-left" data-primary data-ng-click="prevPage()">' +
                '<svg width="11" height="7" viewBox="0 0 11 7">' +
                    '<use xlink:href="#arrow-left"></use>' +
                '</svg>' +
            '</button>' +

            // Pages strip.
            '<div class="date-selector-pages">' + 
                // Page button.
                '<div class="date-selector-page noselect" ' +
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
                    '<svg class="date-selector-page-background" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<div class="date-selector-page-overlay" role="button" ' +
                        'data-ng-mouseover="pageMouseOver($event)" ' +
                        'data-ng-mouseout="pageMouseOut($event)" ' +
                        'data-ng-mousedown="pageMouseDown($event)" ' +
                        'data-ng-mouseup="pageMouseUp($event)">' +
                        '<div class="date-selector-page-label">' +
                            '{{page}}' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                // Next page button.
                // (has to be inside pages container to follow last page button).
                '<div class="date-selector-scroll-right noselect">' +
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
                '</div>' +
            '</div>' +

            // Expand/collapse heading.
            '<button class="date-selector-caption button-inline" data-ng-click="expandCollapse()" data-tooltip="// expand or collapse">' +
                '{{isExpanded === true ? "- by date" : "+"}}' +
            '</button>'
        ));

        // Update visible pages.
        $scope.visiblePages = getVisiblePages($element, $scope);

        // Create the rendered view.
        $scope.view = $render2d.createCanvas(
            $element.find('.date-selector-pages'),
            'date-selector-view',
            $element.width() - $scope.margin * 2,
            $element.height() - $scope.margin * 2 - $scope.pagesHeight);

        // Compile the template.
        $compile($element)($scope);

        // Render for the first time.
        $scope.render();
    });
}

/**
 * Handle custom control resize.
 * @param {object} $scope - The directive scope.
 * @param {object} $render2d - The 2D rendering service.
 */
function resize($scope, $render2d) {
    // Recalculate the page buttons.
    $scope.visiblePages = getVisiblePages(this, $scope);

    // Resize the canvas.
    $render2d.resizeCanvas(
        this.find('.date-selector-view'),
        this.width() - $scope.margin() * 2,
        this.height() - $scope.margin() * 2 - $scope.pagesHeight);

    // Re-render the canvas view.
    $scope.render();
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

}

/**
 * Scroll to previous page.
 * @param {object} $scope - The directive scope.
 */
function nextPage($scope) {

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
        } else {
            $scope.currentPage = $button.find('.date-selector-page-label').text();
            $scope.visiblePages = getVisiblePages(this, $scope);
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
                "robotics": 2,
                "software": 1
            },

            "aug 8": {
                "web": 2,
                "industrial": 1
            },

            "aug 15": {
                "web": 1,
                "industrial": 1,
                "cad": 1,
                "art": 2
            },

            "aug 22": {
                "robotics": 1,
                "painting": 1,
                "mechanical": 2
            },

            "aug 29": {
                "web": 1
            }
        },

        "2": {
            "sep 5": {
                "software": 1
            },

            "sep 12": {
                "industrial": 1
            },

            "sep 19": {
                "electrical": 3,
                "painting": 1
            },

            "sep 26": {
                "music": 2,
                "electrical": 1
            }
        },

        "3": {
            "oct 3": {},

            "oct 10": {
                "web": 1
            },

            "oct 17": {},

            "oct 24": {
                "industrial": 1
            },

            "oct 31": {}
        },

        "4": {
            "nov 7": {
                "painting": 1,
                "web": 1
            },

            "nov 14": {
                "ui": 1,
                "robotics": 3
            },

            "nov 21": {},

            "nov 28": {
                "sql": 1
            }
        },

        "5": {
            "dec 5": {
                "mechanical": 2
            },

            "dec 12": {},

            "dec 19": {
                "painting": 1
            },

            "dec 26": {}
        },

        "6": {
            "jan 2": {
                "robotics": 2,
                "music": 1,
                "web": 1
            },

            "jan 9": {
                "software": 2
            },

            "jan 16": {},

            "jan 23": {
                "software": 1
            },

            "jan 30": {
                "robotics": 3,
                "web": 1,
                "mechanical": 2
            }
        },

        "7": {},
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

    $scope.summary = Object.keys($scope.timeline).map(function(key) {
        // Map date label for each page.
        var month = $scope.timeline[key];
        var weeks = Object.keys(month);

        if (weeks.length) {
            var firstWeekMonthDay = weeks[0].split(' ');
            var lastWeekMonthDay = weeks[weeks.length - 1].split(' ');

            if (firstWeekMonthDay[0] === lastWeekMonthDay[0]) {
                // Use "jan 2 - 10" for example if first and last week have same month.
                return firstWeekMonthDay[0] + ' ' +
                    firstWeekMonthDay[1] + ' - ' +
                    lastWeekMonthDay[1];
            } else {
                // Use "jan 29 - feb 3" for example if first and last week have different months.
                return weeks[0] + ' ' + weeks[weeks.length - 1];
            }
        }
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
    var firstPage = Math.floor((currentPage - sectionPages) / halfSectionPages) * halfSectionPages + pagesBeforeBreak - 1;
    
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
 * Render the custom control view.
 * @param {object} $scope - The directive scope.
 */
function render($scope) {
    // render bars

    // render selection
}