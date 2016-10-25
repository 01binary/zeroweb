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
            "/api/comments/:id",

            {
                id: '@id'
            },
            
            {
                "create": { method: "POST" },
                "edit": { method: "PUT" },
                "upVote":
                {
                    method: "POST",
                    url: "/api/comments/upvote/:id"
                },
                "downVote":
                {
                    method: "POST",
                    url: "/api/comments/downvote/:id"
                }
            }
        );
    }

})();