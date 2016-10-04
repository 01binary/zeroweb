/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that formats primary action buttons.
|  @requires ../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";
        
    /**
     * Register primary directive.
     */
    angular.module("zeroApp")
           .directive("primary", [ "render2d", primaryDirective ]);

    /**
     * Implement primary directive.
     */
    function primaryDirective($render2d)
    {
        return {
            restrict: "A",
            replace: false,
            scope: {},
            link: function($scope, $element, attributes)
            {
                // Calculate the gradient from base color.
                var style = $element.css("background");
                var color = style.substring(
                    style.indexOf("(") + 1, style.indexOf(")")).split(",");
                
                $element.baseHsl = $render2d.rgbToHsl(
                    parseInt(color[0]),
                    parseInt(color[1]),
                    parseInt(color[2]));

                $element.shadowHsl = [
                    $element.baseHsl[0],
                    $element.baseHsl[1],
                    $element.baseHsl[2] - 0.05
                ];

                // Set the gradient.
                fadeButton($element, 0);

                // Add handlers to interpolate the gradient.
                $element.mouseenter(function()
                {
                    // Lighten on mouse over.
                    $({fade:0}).animate({fade:1},
                    {
                        duration: "fast",
                        step: function() { fadeButton($element, +this.fade); }
                    });
                });

                $element.mouseleave(function()
                {
                    // Back to normal on mouse leave.
                    $({fade:1}).animate({fade:0},
                    {
                        duration: "fast",
                        step: function() { fadeButton($element, this.fade); }
                    });
                });
            }
        };
    }

    /**
     * Modify hsl lightness of a linear background on a button.
     * @param {object} $element - The button element.
     * @param {number} fade - The lightness modifier from 0 (do nothing) to 1 (darken slightly to indicate focus).
     */
    function fadeButton($element, fade)
    {
        var scale = 0.05;
        var fadeBase = $element.baseHsl.slice(0);
        var fadeShadow = $element.shadowHsl.slice(0);

        fadeBase[2] += fade * scale;
        fadeShadow[2] += fade * scale;

        $element.css({
            background: buttonGradient(fadeBase, fadeShadow)
        });
    }

    /**
     * Serializes a css gradient declaration for button background.
     * @param {int[3]} baseColorHsl - Base color in HSL as 3-component int array.
     * @param {int[3]} shadowColorHsl - Shadow color in HSL as a 3-component int array.
     * @returns {string} Button gradient css declaration.
     */
    function buttonGradient(baseColorHsl, shadowColorHsl)
    {
        return "linear-gradient(hsl(" +
            Math.ceil(baseColorHsl[0] * 360) +
            "," +
            Math.ceil(baseColorHsl[1] * 100) +
             "%," +
            Math.ceil(baseColorHsl[2] * 100) +
            "%) 40%,hsl(" +
            Math.ceil(shadowColorHsl[0] * 360) +
            "," +
            Math.ceil(shadowColorHsl[1] * 100) +
            "%," +
            Math.ceil(shadowColorHsl[2] * 100) +
            "%) 100%)";
    }

})();