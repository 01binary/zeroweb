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

    // Create initial custom control elements.
    $element.addClass('date-selector');
    $element.addClass('loading');

    $scope.background = $('<div></div>')
        .addClass('date-selector-background')
        .appendTo($element);

    $scope.heading = $('<button>date</button>')
        .addClass('date-selector-heading')
        .addClass('button-inline')
        .click(expandCollapse.bind($element, $scope))
        .appendTo($element);

    // Load content and create the rest of the elements when loaded.
    loadContent($q, $http, $scope).then(function() {
        $scope.scrollLeft = $('<button data-primary></button>')
            .addClass('date-selector-scroll')
            .addClass('date-selector-scroll-left')
            .click(prevPage.bind($element, $scope))
            .appendTo($element);

        $scope.scrollRight = $('<button data-primary></button>')
            .addClass('date-selector-scroll')
            .addClass('date-selector-scroll-right')
            .click(nextPage.bind($element, $scope))
            .appendTo($element);

        $scope.pages = $('<div></div>')
            .addClass('date-selector-pages')
            .appendTo($element);

        $scope.pageNumbers = $('<div></div>')
            .addClass('date-selector-page-numbers')
            .appendTo($scope.pages);

        $scope.dates = $('<div></div>')
            .addClass('dates-selector-dates')
            .appendTo($scope.pages);

        $scope.view = $render2d.createCanvas(
            $scope.pages,
            'date-selector-view',
            $element.width() - 10,
            $element.height() - 10);

        $element.onresize =
            resize.bind($element, $render2d, $scope);

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