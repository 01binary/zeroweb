/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Factory that loads news stories.
|  @requires ../angular/angular.js
|  @requires ../angular-resource/angular-resource.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";

    /**
     * Register news factory.
     */
    angular.module("zeroApp")
           .factory("news", ["$resource", newsFactory]);

    /**
     * Implement news factory.
     * @param {object} $resource - AJAX service.
     */
    function newsFactory($resource)
    {
        return $resource(
            "/api/news/:id",

            {
                id: '@id'
            },
            
            {
                "star":
                {
                    method: "POST",
                    url: "/api/news/star/:id"
                }
            });
    }

})();