/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Factory that loads site comments.
|  @requires ../angular/angular.js
|  @requires ../angular-resource/angular-resource.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";

    /**
     * Register comments factory.
     */
    angular.module("zeroApp")
           .factory("comments", ["$resource", commentsFactory]);

    /**
     * Implement comments factory.
     * @param {object} $resource - AJAX service.
     */
    function commentsFactory($resource)
    {
        return $resource(
            "/services/comments/:id",

            {
                id: '@id'
            },
            
            {
                "create": { method: "POST" },
                "edit": { method: "PUT" },
                "upvote":
                {
                    method: "POST",
                    url: "/services/comments/upvote/:id"
                },
                "downvote":
                {
                    method: "POST",
                    url: "/services/comments/downvote/:id"
                }
            }
        );
    }

})();