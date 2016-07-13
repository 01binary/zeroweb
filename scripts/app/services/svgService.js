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

"use strict"

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
    this.promiseService = $q;
    
    /**
     * @type {object} Service used to make ajax requests.
     */
    this.ajaxService = $http;
    
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
     * @param {string} fallbackGroup - Fallback symbol if original doesn't exist.
     * @param {string} classToApply - Set class on new element.
     * @returns {object} Promise that receives new SVG element.
     *
     * @example load($("#viewer), "images/tiger.svg")
     * @example load($("#panel), "images/symbol-set.svg#symbol-name", "fallback-symbol", "myclass")
     */
    function load($container, iconUri, fallbackGroup, classToApply)
    {
        if (~iconUri.indexOf("#"))
        {
            var sourceComponents = iconUri.split("#");

            return this.loadIconFromDefinition(
                $container,
                sourceComponents[0],
                sourceComponents[1],
                fallbackGroup,
                classToApply);
        }
        else
        {
            return this.loadIconFromFile(
                $container, iconUri, classToApply);
        }
    }

    /**
     * Create SVG use fragment referring to symbol in symbol set.
     * @param {object} $container - jQuery to prepend inline SVG reference to.
     * @param {string} definitionUri - Uri of SVG with symbol definitions.
     * @param {string} groupName - Symbol name in definition SVG.
     * @param {string} fallbackGroupName - Fallback symbol name in definition SVG.
     * @param {string} classToApply - Set class on inline reference SVG element.
     * @returns {object} Promise that receives jQuery object for inline SVG.
     */
    function loadIconFromDefinition(
        $container, definitionUri, groupName, fallbackGroupName, classToApply)
    {
        return this.promiseService(function(resolve)
        {
            this.loadIconDefinition(definitionUri).then(function($loaded)
            {   
                if (fallbackGroupName && !$loaded.find("#" + groupName).length)
                {
                    groupName = fallbackGroupName;
                }
                
                var $svg = $("<svg><use xlink:href=\"#" + groupName + "\"></use></svg>")
                    .prependTo($container);
                
                if (classToApply)
                    $svg.addClass(classToApply);
                
                resolve($loaded);
            });
        }.bind(this));
    }

    /**
     * Load SVG fragment.
     * @param {object} $container - jQuery Lite element to prepend to.
     * @param {string} iconUri - Uri for ajax request.
     * @param {string} classToApply - Set class on new element.
     * @returns {object} Promise that receives jQuery object for new element.
     */
    function loadIconFromFile($container, iconUri, classToApply)
    {   
        return this.promiseService(function(resolve)
        {   
            this.ajaxService
            ({
                url: iconUri,
                cache: true
            }).then(function(request)
            {                
                var content = new DOMParser().parseFromString(
                    request.data, "application/xml");
                
                resolve($("svg", content).prependTo($container), null);
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
            this.promiseService(function(resolve)
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