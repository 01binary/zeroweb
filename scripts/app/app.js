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

"use strict";

/**
 * Implement the Angular application.
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
            templateUrl: "views/news.htm",
            controller: "newsController"
        })
        .when("/articles",
        {
            templateUrl: "views/articles.htm",
            controller: "articlesController"
        })
        .when("/projects",
        {
            templateUrl: "views/projects.htm",
            controller: "projectsController"
        })
        .when("/about",
        {
            templateUrl: "views/about.htm",
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