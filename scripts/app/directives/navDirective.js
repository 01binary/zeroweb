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

"use strict"
    
/*
 * Register nav directive.
 */
angular.module("zeroApp")
       .directive("nav", ["svg", navDirective]);

/**
 * Implement nav directive.
 * @param {factory} $svg - SVG factory.
 */
function navDirective($svg)
{
    return {
        restrict: "E",
        replace: false,
        link: function($scope, $element, attributes)
        {
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
        }
    };
}