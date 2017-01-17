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
    $('<button>date</button>')
        .addClass('date-selector-heading')
        .addClass('button-inline')
        .click(expandCollapse.bind($element, $scope))
        .appendTo($element);

    // Load content and create the rest of the elements when loaded.
    loadContent($q, $http, $scope).then(function() {
        // Page button backgrounds.
        $('<svg version="1.1" ' +
            'xmlns="http://www.w3.org/2000/svg" ' +
            'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
            'style="display:none">' +
            '<defs>' +
                '<linearGradient id="mom">' +
                    '<stop offset="0%" style="stop-color:red"/>' +
                    '<stop offset="50%" style="stop-color:green"/>' +
                '</linearGradient>' +
            '</defs>' +
            '<symbol id="page-button-top">' +
	            '<polygon fill="url(#mom)" points="0.8,17.5 9.2,0.5 40.1,0.5 47.2,17.5"/>' +
            '</symbol>' +
        '</svg>').appendTo($element);

        // Create left scroll button.
        $('<button data-primary></button>')
            .addClass('date-selector-scroll')
            .addClass('date-selector-scroll-left')
            .click(prevPage.bind($element, $scope))
            .appendTo($element);

        // Create right scroll button.
        $('<button data-primary></button>')
            .addClass('date-selector-scroll')
            .addClass('date-selector-scroll-right')
            .click(nextPage.bind($element, $scope))
            .appendTo($element);

        // Create paging containers.
        var pages = $('<div></div>')
            .addClass('date-selector-pages')
            .appendTo($element);

        $('<div></div>')
            .addClass('date-selector-page-numbers')
            .append(
                $('<div data-ng-repeat="(page, weeks) in timeline">' +
                    '<div>{{page}}</div>' +
                    '<svg width="48" height="18" viewBox="0 0 48 18">' +
                        '<use xlink:href="#page-button-top"></use>' +
                    '</svg>' +
                '</div>'))
            .appendTo(pages);

        $('<div></div>')
            .addClass('date-selector-dates')
            .appendTo(pages);

        // Create the rendered view.
        $scope.view = $render2d.createCanvas(
            pages,
            'date-selector-view',
            $element.width() - 10,
            $element.height() - 10);

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

    console.log($scope.summary);

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