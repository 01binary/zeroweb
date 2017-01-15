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
 * Register dateSelector directive.
 */
angular.module('zeroApp')
    .directive('dateselector', [ '$q', '$http', '$compile', 'render2d', dateSelectorDirective ]);

/**
 * Implement dateSelector directive.
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
 * Initialize the date selector control.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $render2d - The 2D rendering service.
 * @param {object} $scope - The directive scope.
 * @param {object} $element - The directive element.
 */
function initialize($q, $http, $compile, $render2d, $scope, $element) {
    $element.addClass('date-selector');

    $scope.background = $('<div></div>')
        .addClass('date-selector-background')
        .appendTo($element);

    $scope.expanded = true;
    $scope.heading = $('<button>date</button>')
        .addClass('date-selector-heading')
        .addClass('button-inline')
        .click(expandCollapse.bind($element, $scope))
        .appendTo($element);

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

    $scope.view = $render2d.createCanvas(
        $scope.pages,
        'date-selector-view',
        $element.width() - 10,
        $element.height() - 10);

    $element.onresize =
        resize.bind($element, $render2d, $scope);

    $compile($element)($scope);
}

function resize($render2d, $scope) {

}

function expandCollapse($scope) {
    $scope.expanded = !$scope.expanded;

    if ($scope.expanded) {
        this.removeClass('date-selector-collapsed');
    } else {
        this.addClass('date-selector-collapsed');
    }
}

function prevPage($scope) {

}

function nextPage($scope) {

}

function startScroll() {

}

function doScroll() {

}

function endScroll() {

}

function loadTimeline() {
    // article count by type for mon-sunday week.
    // TODO: need AJAX endpoint.
}

function render() {
    // render bars

    // render selection
}