/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Application module
|  @requires ../angular/angular.js
|  @requires ../angular-route/angular-route.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";

    /**
     * Implement Angular application.
     */
    angular.module("zeroApp", ["ngRoute"])
        .config(["$routeProvider", "$locationProvider", route]);

    /**
     * Implement application routing.
     * @param {object} $routeProvider - Route configuration provider.
     * @param {object} $locationProvider - Location query provider.
     */
    function route($routeProvider, $locationProvider)
    {
        $routeProvider
            .when("/",
            {
                templateUrl: "views/news",
                controller: "newsController"
            })
            .when("/articles",
            {
                templateUrl: "views/articles",
                controller: "articlesController"
            })
            .when("/projects",
            {
                templateUrl: "views/projects",
                controller: "projectsController"
            })
            .when("/about",
            {
                templateUrl: "views/about",
                controller: "aboutController"
            })
            .otherwise(
            {
                redirectTo: "/"
            });
        
        $locationProvider.html5Mode(
        {
            enabled: true,
            requireBase: false,
            rewriteLinks: true
        });
    }

})();