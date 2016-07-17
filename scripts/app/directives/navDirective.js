/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that loads navigation vector graphics.
|  @requires ../angular/angular-min.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

"use strict";
    
/**
 * Register nav directive.
 */
angular.module("zeroApp")
       .directive("nav", ["svg", "$rootScope", navDirective]);

/**
 * Implement nav directive.
 * @param {object} $svg - SVG factory.
 * @param {object} $rootScope - Root application scope.
 */
function navDirective($svg, $rootScope)
{   
    return {
        restrict: "E",
        replace: false,
        scope: {},
        link: function($scope, $element, attributes)
        {
            $scope.updateNavigation = updateNavigation;
            $scope.getRouteName = getRouteName;
            
            // Load navigation.
            var navSrc = attributes["src"];
            
            var buttonParts =
            [
                "matte",
                "hover",
                "border",
                "highlight",
                "icon",
                "selection"
            ];

            $element.find("a").each(function(index)
            {
                // Scripted hovers due to poor CSS support.
                $(this).mouseenter(function()
                {
                    var $elem = $(this).find(".navigation-hover").stop().fadeIn("fast");
                });

                $(this).mouseleave(function()
                {
                    var $elem = $(this).find(".navigation-hover").stop().fadeOut("fast");
                });

                var buttonName = $(this).text();
                $(this).text("");

                for (var partIndex in buttonParts)
                {
                    $svg.load
                    (
                        // Prepend to this element.
                        $(this),

                        // Attempt to find a part for this specific button.
                        navSrc + "#" + buttonName + "-" + buttonParts[partIndex],

                        // Fallback to generic part name.
                        buttonParts[partIndex],

                        // Class to apply.
                        "navigation navigation-" + buttonParts[partIndex]
                    );
                }

                // Append button text.
                $("<div></div>")
                    .text(buttonName)
                    .addClass("navigation navigation-text")
                    .appendTo($(this));
            });
            
            // Update navigation styles when changing views.
            $rootScope.$on
            (
                "$routeChangeStart",
                function(event, next, current)
                {
                    $scope.updateNavigation(next, current, $rootScope);
                }
            );
        }
    };
}

/**
 * Update navigation on route change.
 * @param {object} next - Future route information.
 * @param {object} current - Current route information.
 * @param {object} $rootScope - Root scope object.
 */
function updateNavigation(next, current, $rootScope)
{
    var routeName = this.getRouteName(next);

    if (current)
    {
        var $buttons = $("nav a");
        var prevSelected = false;

        $buttons.each(function(index, element)
        {
            var afterSelectedStyle = prevSelected ?
                " navigation-afterselected" : "";

            var selectedStyle = (prevSelected = $(this).attr("href") == routeName) ?
                "navigation-selected" : "navigation-unselected";

            var lastStyle = index == $buttons.length - 1 ?
                " navigation-last" : "";

            $(this).attr("class", selectedStyle + afterSelectedStyle + lastStyle);
        });
    }

    $rootScope.lastRouteName = routeName;
}

/**
 * Parse route name.
 * @param {object} $route - Route to examine.
 * @returns {string} Route name.
 */
function getRouteName($route)
{
    if (!$route.templateUrl || $route.templateUrl.indexOf("/") == -1)
        return null;

    return $route.templateUrl.split("/")[1].split(".")[0];
}