/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that formats markdown content.
|  @requires ../markdown-it/dist/markdown-it.js
|  @requires ../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/**
 * Register markdown directive.
 */
angular.module('zeroApp')
    .directive('markdown', markdownDirective);

/**
 * Implement markdown directive.
 * 
 */
function markdownDirective()
{
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div ng-transclude></div>',
        scope: {},
        link: function($scope, $element, attributes) {
            if (attributes['inline'] != undefined) {
                // Process static contents.
                $element.html(window.markdownit().render($element.text()));
            } else {
                // Watch binding expression and process when bindings are resolved.
                $scope.unresolvedText = $element.text();
                $scope.stopWatching = $scope.$watch(
                    function() {
                        return $element.text();
                    },
                    function(value) {
                        if ($scope.unresolvedText == value ||
                            attributes['ignore'] == value) {
                            return;
                        }

                        $element.html(window.markdownit().render(value));
                        $scope.stopWatching();

                        transformHeadings($element);
                    }
                );
            }
        }
    };
}

/*
 * Decorate dynamically generated headings with permalinks.
 * @param {object} container - Container element jQuery object.
 */
function transformHeadings($container) {
    var anchorTemplate = '<a class="permalink-anchor">#</a>';
    var $articleTitle = $container.closest('.article').find('.permalink-anchor');

    if ($articleTitle.length === 0) {
        console.log('cannot find article title', $('.permalink-anchor').length);
        return;
    }
    
    var baseUrl = $articleTitle.attr('href');

    $container.find('h3,h4').each(function() {
        var $heading = $(this);
        var $anchor = $(anchorTemplate);
        var anchorName = $heading.text().toLowerCase().trim().replace(' ', '-');

        $anchor
            .attr('href', baseUrl + '#' + anchorName)
            .attr('name', anchorName)
            .prependTo($heading);
    });
}