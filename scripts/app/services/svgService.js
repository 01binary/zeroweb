/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Service that loads inline vector graphics.
|  @requires ../../angular/angular.js
|  @requires ../../jquery/dist/jquery.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";

    /**
     * Register svg service.
     */
    angular.module("zeroApp")
        .service("svg", ["$q", "$http", svgService]);

    /**
     * Implement svg service.
     * @param {object} $q - Inject promise service.
     * @param {object} $http - Inject ajax service.
     */
    function svgService($q, $http)
    {
        /**
         * @type {object} Service used to create promises.
         */
        this.promiseProvider = $q;
        
        /**
         * @type {object} Service used to make ajax requests.
         */
        this.ajaxProvider = $http;
        
        /**
         * @type {function} Prepend inline SVG fragment to container.
         */
        this.load = load;
        
        /**
         * @type {function} Create SVG use fragment referring to symbol in symbol set.
         */
        this.loadIconFromDefinition = loadIconFromDefinition;
        
        /**
         * @type {function} Load SVG fragment.
         */
        this.loadIconFromFile = loadIconFromFile;
        
        /**
         * @type {function} Load SVG symbol set fragment.
         */
        this.loadIconDefinition = loadIconDefinition;
        
        /**
         * Prepend inline SVG fragment to container.
         * @param {object} $container - jQuery to prepend to.
         * @param {string} iconUri - Uri for ajax request, use '#' to specify symbol in set.
         * @param {string} fallbackGroup - Fallback symbol if original doesn't exist (optional).
         * @param {string} classToApply - Set class on new element (optional).
         * @param {int} width - The width to set on the inline svg (optional).
         * @param {int} height - The height to set on the inline svg (optional).
         * @returns {object} Promise that receives new SVG element.
         *
         * @example load($("#viewer), "images/tiger.svg")
         * @example load($("#panel), "images/symbol-set.svg#symbol-name", "fallback-symbol", "myclass")
         */
        function load($container, iconUri, fallbackGroup, classToApply, width, height)
        {
            if (~iconUri.indexOf("#"))
            {
                var sourceComponents = iconUri.split("#");

                return this.loadIconFromDefinition(
                    $container,
                    sourceComponents[0],
                    sourceComponents[1],
                    fallbackGroup,
                    classToApply,
                    width,
                    height);
            }
            else
            {
                return this.loadIconFromFile(
                    $container, iconUri, classToApply, width, height);
            }
        }

        /**
         * Create SVG use fragment referring to symbol in symbol set.
         * @param {object} $container - jQuery to prepend inline SVG reference to.
         * @param {string} definitionUri - Uri of SVG with symbol definitions.
         * @param {string} groupName - Symbol name in definition SVG.
         * @param {string} fallbackGroupName - Fallback symbol name in definition SVG (optional).
         * @param {string} classToApply - Set class on inline reference SVG element (optional).
         * @param {int} width - The width to set on the inline svg (optional).
         * @param {int} height - The height to set on the inline svg (optional).
         * @returns {object} Promise that receives jQuery object for inline SVG.
         */
        function loadIconFromDefinition(
            $container, definitionUri, groupName, fallbackGroupName, classToApply, width, height)
        {
            return this.promiseProvider(function(resolve)
            {
                this.loadIconDefinition(definitionUri).then(function($loaded)
                {   
                    if (fallbackGroupName && !$loaded.find("#" + groupName).length)
                    {
                        groupName = fallbackGroupName;
                    }
                    
                    var $svg = null;

                    if (width && height)
                    {
                        $svg = $("<svg width=\"" + width + "\" height=\"" + height +
                                 "\" viewBox=\"0 0 " + width + " " + height +
                                 "\"><use xlink:href=\"#" + groupName + "\"></use></svg>");
                    }
                    else
                    {
                        $svg = $("<svg><use xlink:href=\"#" + groupName + "\"></use></svg>");
                    }

                    $svg.prependTo($container);
                    
                    if (classToApply)
                    {
                        $svg.addClass(classToApply);
                    }
                    
                    resolve($loaded);
                });
            }.bind(this));
        }

        /**
         * Load SVG fragment.
         * @param {object} $container - jQuery Lite element to prepend to.
         * @param {string} iconUri - Uri for ajax request.
         * @param {string} classToApply - Set class on new element.
         * @param {int} width - The width to set on the inline svg (optional).
         * @param {int} height - The height to set on the inline svg (optional).
         * @returns {object} Promise that receives jQuery object for new element.
         */
        function loadIconFromFile($container, iconUri, classToApply, width, height)
        {   
            return this.promiseProvider(function(resolve)
            {   
                this.ajaxProvider
                ({
                    url: iconUri,
                    cache: true
                }).then(function(request)
                {                
                    var content = new DOMParser().parseFromString(
                        request.data, "application/xml");

                    var $svg = $("svg", content).prependTo($container);

                    if (width && height)
                    {
                        $svg.get(0).setAttributeNS(null, "width", width);
                        $svg.get(0).setAttributeNS(null, "height", height);
                        $svg.get(0).setAttributeNS(null, "viewBox", "0 0 " + width + " " + height);
                    }
                    
                    resolve($svg, null);
                });
            }.bind(this));
        }

        /**
         * Load SVG symbol set fragment.
         * @param {string} definitionUri - SVG uri in ajax request.
         * @returns {object} Promise that receives loaded SVG jQuery object.
         */
        function loadIconDefinition(definitionUri)
        {
            if (!loadIconDefinition.loaded)
            {
                loadIconDefinition.loaded = {};
            }

            if (loadIconDefinition.loaded[definitionUri])
            {
                return loadIconDefinition.loaded[definitionUri];
            }

            loadIconDefinition.loaded[definitionUri] =
                this.promiseProvider(function(resolve)
            {
                this.loadIconFromFile($("body"), definitionUri)
                .then(function($loaded)
                {
                    // Hide definition after it's loaded.
                    $loaded.get(0).setAttributeNS(null, "style", "display:none");

                    // Provide loaded SVG to promise resolve callback.
                    resolve($loaded);
                });
            }.bind(this));

            return loadIconDefinition.loaded[definitionUri];
        }
    }
    
})();