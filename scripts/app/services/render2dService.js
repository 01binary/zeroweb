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
        
        /*
        * Get css property.
        * @type {function}
        */
        this.getCss = getCss;
        
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