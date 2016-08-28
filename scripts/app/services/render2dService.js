/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Service that supports 2d rendering on canvas.
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";

    /**
     * Register render2d service.
     */
    angular.module("zeroApp")
           .service("render2d", render2dService);

    /**
     * Implement render2d service.
     */
    function render2dService()
    {
        /**
         * Create canvas for rendering custom controls.
         * @type {function}
         */
        this.createCanvas = createCanvas;
        
        /**
         * Draw themed bullet.
         * @type {function}
         */
        this.drawBullet = drawBullet;
        
        /**
         * Get canvas drawing context.
         * @type {function}
         */
        this.getContext = getContext;
        
        /**
        * Get css property.
        * @type {function}
        */
        this.getCss = getCss;

        /**
         * Convert rgb color to hsl component array.
         * @type {function}
         */
        this.rgbToHsl = rgbToHsl;

        /**
         * Convert hsl color to rgb component array.
         * @type {function}
         */
        this.hslToRgb = hslToRgb;
        
        /**
         * Create canvas for rendering custom controls.
         * @param {object} $before - jQuery referring to DOM element to insert before.
         * @param {string} className - Canvas class name.
         * @param {number} width - Canvas width.
         * @param {number} height - Canvas height.
         */
        function createCanvas($before, className, width, height)
        {
            // Apply both element and css size to
            // increase bitmap resolution on high-dpi screens.
            var pixelRatio = window.devicePixelRatio ||
                            window.screen.deviceXDPI / window.screen.deviceYDPI;

            var canvas = $("<canvas></canvas>")
                        .attr("class", className)
                        .attr("width", width * pixelRatio)
                        .attr("height", height * pixelRatio)
                        .css("width", width)
                        .css("height", height)
                        .insertBefore($before).get(0);

            // Apply scale transform to render larger on hi-dpi screens.
            var context = this.getContext(canvas);
            context.scale(pixelRatio, pixelRatio);

            return canvas;
        }
        
        /**
         * Get canvas drawing context.
         * @param {object} canvas - Canvas element.
         */
        function getContext(canvas)
        {
            return canvas.getContext("2d");
        }
        
        /*
        * Get css property.
        * @param {string} className - CSS class name.
        * @param {string} propertyName - CSS property.
        */
        function getCss(className, propertyName)
        {
            var $temp = $("<div class='" + className + "'></div>").appendTo($("body"));
            var result = $temp.css(propertyName);
            
            $temp.remove();
            
            return result;
        }

        /**
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes h, s, and l are contained in the set [0, 1] and
         * returns r, g, and b in the set [0, 255].
         *
         * @param {number} h - Hue.
         * @param {number} s - Saturation.
         * @param {number} l - Lightness.
         * @return {Array} RGB representation.
         */
        function hslToRgb(h, s, l)
        {
            var r, g, b;

            if (s == 0)
            {
                r = g = b = l;
            }
            else
            {
                var hue2rgb = function hue2rgb(p, q, t)
                {
                    if(t < 0) t += 1;
                    if(t > 1) t -= 1;
                    if(t < 1/6) return p + (q - p) * 6 * t;
                    if(t < 1/2) return q;
                    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;

                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
        }

        /**
         * Converts an RGB color value to HSL. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes r, g, and b are contained in the set [0, 255] and
         * returns h, s, and l in the set [0, 1].
         *
         * @param {number} r - Red.
         * @param {number} g - Green.
         * @param {number} b - Blue.
         * @return {Array} HSL representation.
         */
        function rgbToHsl(r, g, b)
        {
            r /= 255, g /= 255, b /= 255;

            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min)
            {
                h = s = 0;
            }
            else
            {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                switch(max)
                {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }

                h /= 6;
            }

            return [h, s, l];
        }

        /**
         * Draw themed bullet.
         * @param {RenderingContext} context2d - Drawing context.
         * @param {string} fill - Fill color in rgb(), hex, or friendly form (red, blue).
         * @param {number} left - Horizontal offset from canvas left.
         * @param {number} top - Vertical offset from canvas top.
         * @param {number} width - Bullet width, default 3px.
         * @param {number} height - Bullet height, default 13px.
         */
        function drawBullet(context2d, fill, left, top, width, height)
        {
            if (!width) width = 3;
            if (!height) height = 13;

            context2d.fillStyle = fill;
            context2d.beginPath();
            context2d.moveTo(left, top);
            context2d.lineTo(left, top + height);
            context2d.lineTo(left + width, top + height);
            context2d.lineTo(left + width, top + 3);
            context2d.closePath();
            context2d.fill();
        }
    }

})();