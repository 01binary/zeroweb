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
 * Register dateselector directive.
 */
angular.module('zeroApp')
    .directive('dateselector', [ '$q', '$http', '$compile', 'render2d', dateSelectorDirective ]);

/**
 * Implement dateselector directive.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $render2d - The rendering service.
 */
function dateSelectorDirective($q, $http, $compile, $render2d) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div></div>',
        scope: {},
        link: function($scope, $element, attributes) {
            initialize($q, $http, $compile, $render2d, $scope, $element);
        }
    };
}

/**
 * Initialize custom control.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $render2d - The 2D rendering service.
 * @param {object} $scope - The directive scope.
 * @param {object} $element - The directive element.
 */
function initialize($q, $http, $compile, $render2d, $scope, $element) {
    // Set initial state.
    $scope.loading = true;
    $scope.expanded = true;
    $scope.scrolling = false;
    $scope.timeline = {};

    // Create initial elements.
    $element.addClass('date-selector');
    $element.addClass('loading');

    // Create background rectangle.
    $('<div></div>')
        .addClass('date-selector-background')
        .appendTo($element);

    // Create expand/collapse heading.
    $('<button>by date</button>')
        .addClass('date-selector-heading')
        .addClass('button-inline')
        .click(expandCollapse.bind($element, $scope))
        .appendTo($element);

    // Load content and create the rest of the elements when loaded.
    loadContent($q, $http, $scope).then(function() {
        // Create graphic resources.
        $('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">' +
            '<linearGradient id="page-button-gradient" style="display:block" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="30">' +
                '<stop offset="0" style="stop-color:rgb(250,250,250)"/>' +
                '<stop offset="1" style="stop-color:rgb(235,235,235)"/>' +
            '</linearGradient>' +
            '<symbol id="page-button-border">' +
                '<polyline fill="none" class="page-button-highlight" points="2.9,30.5 8.5,24.9 8.5,1.5 29.5,1.5"/>' +
                '<polyline fill="none" class="page-button-shadow" points="29.5,2 29.5,24.1 23.1,30.5 1.8,30.5"/>' +
                '<polygon fill="none" points="23.5,31.5 30.5,24.5 30.5,0.5 7.5,0.5 7.5,24.5 0.5,31.5"/>' +
            '</symbol>' +
            '<symbol id="page-button-background">' +
                '<polygon fill="url(#page-button-gradient)" stroke="none" points="23.5,31.5 30.5,24.5 30.5,0.5 7.5,0.5 7.5,24.5 0.5,31.5"/>' +
            '</symbol>' +
            '<symbol id="arrow-left">' +
                '<path d="M0,3.5l3.1-3.1h1.5L2.1,3h8.8V4H2.1l2.5,2.5H3.1L0,3.5z"/>' +
            '</symbol>' +
            '<symbol id="arrow-right">' +
                '<path d="M7.9,6.6H6.4L8.9,4H0.2V3h8.8L6.4,0.4h1.5L11,3.5L7.9,6.6z"/>' +
            '</symbol>' +
        '</svg>').appendTo($element);

        // Create left scroll button.
        $('<button data-primary>' +
            '<svg width="11" height="7" viewBox="0 0 11 7">' +
                '<use xlink:href="#arrow-left"></use>' +
            '</svg>' +
        '</button>')
            .addClass('date-selector-scroll')
            .addClass('date-selector-scroll-left')
            .click(prevPage.bind($element, $scope))
            .appendTo($element);

        // Create right scroll button.
        $('<button data-primary>' +
            '<svg width="11" height="7" viewBox="0 0 11 7">' +
                '<use xlink:href="#arrow-right"></use>' +
            '</svg>' +
        '</button>')
            .addClass('date-selector-scroll')
            .addClass('date-selector-scroll-right')
            .click(nextPage.bind($element, $scope))
            .appendTo($element);

        // Create paging containers.
        $('<div></div>')
            .addClass('date-selector-pages')
            .append(
                $('<div class="date-selector-page" data-ng-repeat="(page, weeks) in timeline">' +
                    '<div class="date-selector-page-label">{{page}}</div>' +
                    '<svg class="date-selector-page-border" width="31" height="32" viewBox="0 0 31 32">' +
                        '<use xlink:href="#page-button-border"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-hover" width="31" height="32" viewBox="0 0 31 32">' +
                        '<use xlink:href="#page-button-hover"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-pushed" width="31" height="32" viewBox="0 0 31 32">' +
                        '<use xlink:href="#page-button-pushed"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-background" width="31" height="32" viewBox="0 0 31 32">' +
                        '<use xlink:href="#page-button-background"></use>' +
                    '</svg>' +
                '</div>'))
            .appendTo($element);

        // Create the rendered view.
        /*$scope.view = $render2d.createCanvas(
            pages,
            'date-selector-view',
            $element.width() - 10,
            $element.height() - 10);*/

        // Register handlers.
        $element.onresize =
            resize.bind($element, $render2d, $scope);

        // Render for the first time.
        $element.removeClass('loading');
        $compile($element)($scope);
        render.apply($element, $scope);
    });
}

/**
 * Handle custom control resize.
 * @param {object} $render2d - The 2D rendering service.
 * @param {object} $scope - The directive scope.
 */
function resize($render2d, $scope) {
    // TODO: resize canvas
    render.apply(this, $scope);
}

/**
 * Expand or collapse the custom control.
 * @param {object} $scope - The directive scope.
 */
function expandCollapse($scope) {
    $scope.expanded = !$scope.expanded;

    if ($scope.expanded) {
        this.removeClass('date-selector-collapsed');
    } else {
        this.addClass('date-selector-collapsed');
    }
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
        }
    };

    $scope.summary = Object.keys($scope.timeline).map(function(key) {
        // Map date label for each page.
        var month = $scope.timeline[key];
        var weeks = Object.keys(month)
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
    });

    $scope.loading = false;

    return $q.when();
}

/**
 * Render the custom control view.
 * @param {object} $scope - The directive scope.
 */
function render($scope) {
    // render bars

    // render selection
}