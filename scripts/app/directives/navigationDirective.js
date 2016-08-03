/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that loads navigation vector graphics.
|  @requires ../jquery/dist/jquery.js
|  @requires ../angular/angular-min.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";
        
    /**
     * Register navigation directive.
     */
    angular.module("zeroApp")
           .directive("navigation", ["svg", "$rootScope", navigationDirective]);

    /**
     * Implement navigation directive.
     * @param {object} $svg - Service used to load inline SVG fragments.
     * @param {object} $rootScope - Root application scope.
     */
    function navigationDirective($svg, $rootScope)
    {   
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            template: "<nav ng-transclude></nav>",
            scope: {},
            link: function($scope, $element, attributes)
            {
                /**
                 * Load graphics for navigation links.
                 * @type {function}
                 */
                $scope.loadNavigation = loadNavigation;
                
                /**
                 * Update navigation on route change.
                 * @type {function}
                 */
                $scope.updateNavigation = updateNavigation;
                
                /*
                * Initialize directive.
                */
                $scope.loadNavigation($svg, $element, attributes);
                
                $rootScope.$on("$routeChangeStart", function(event, next, current)
                {
                    $scope.updateNavigation(next, current, $rootScope);
                });
            }
        };
    }

    /*
    * Load graphics for navigation links.
    * @param {object} $svg - Service used to load inline SVG fragments.
    * @param {object} $element - jQuery of navigation container element.
    * @param {object} attributes - Navigation container attribute map.
    */
    function loadNavigation($svg, $element, attributes)
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

    /**
     * Update navigation on route change.
     * @param {object} next - Future route information.
     * @param {object} current - Current route information.
     * @param {object} $rootScope - Root scope object.
     */
    function updateNavigation(next, current, $rootScope)
    {
        if (next.templateUrl)
        {
            // Update page title.
            if (!this.baseTitle)
                this.baseTitle = $("title").text();

            var page = next.templateUrl.substring(next.templateUrl.indexOf("/") + 1);
            $("title").text(page[0].toUpperCase() + page.substring(1) + " - " + this.baseTitle);

            // Update navigation styles.
            var $buttons = $("nav a");
            var prevSelected = false;

            $buttons.each(function(index, element)
            {
                var afterSelectedStyle = prevSelected ?
                    " navigation-afterselected" : "";

                var selectedStyle =
                    (prevSelected = "views/" + $(this).attr("href") == next.templateUrl) ?
                    "navigation-selected" : "navigation-unselected";

                var lastStyle = index == $buttons.length - 1 ?
                    " navigation-last" : "";

                $(this).attr("class", selectedStyle + afterSelectedStyle + lastStyle);
            });
        }
    }

})();