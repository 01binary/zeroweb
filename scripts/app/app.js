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
       .config(["$routeProvider", "$locationProvider", route])
       .run(["$rootScope", "$location", run]);

/**
 * Implement application startup.
 */
function run($rootScope, $location)
{
    $rootScope.$on
    (
        "$routeChangeStart",
        function(event, next, current)
        {
            onRouteChangeStart(event, next, current, $rootScope);
        }
    );
}

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

/*
 * Handle route change.
 * @param {object} event - Synthetic event object.
 * @param {object} next - Future route information.
 * @param {object} current - Current route information.
 * @param {object} $rootScope - Root scope object.
 */
function onRouteChangeStart(event, next, current, $rootScope)
{    
    var routeName = getRouteName(next);
    
    if (current)
    {
        var $buttons = $("nav a");
        var prevSelected = false;
        
        $buttons.each(function(index, element)
        {
            if (prevSelected)
            {
                $(this).addClass("navigation-afterselected");
                prevSelected = false;
            }
            else
            {
                $(this).removeClass("navigation-afterselected");
            }
            
            if ($(this).attr("href") == routeName)
            {   
                $(this).removeClass("navigation-unselected")
                       .addClass("navigation-selected");
                
                prevSelected = true;
            }
            else
            {
                $(this).removeClass("navigation-selected")
                       .addClass("navigation-unselected");
            }
            
            if (index == $buttons.length - 1)
            {
                $(this).addClass("navigation-last");
            }
        });
    }
    
    $rootScope.lastRouteName = routeName;
}

/*
 * Parse route name.
 * @param {object} $route - Route to examine.
 * @returns {string} Route name.
 */
function getRouteName($route)
{
    if (!$route.templateUrl)
        return null;
    
    return $route.templateUrl.substring(
        $route.templateUrl.indexOf("/") + 1).split(".")[0];
}