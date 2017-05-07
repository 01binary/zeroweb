/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Application module.
|  @requires ../angular/angular.js
|  @requires ../angular-route/angular-route.js
|  @requires ../angular-route/angular-resource.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

/**
 * Implement Angular application.
 */
angular.module('zeroApp', [
    'ngRoute',
    'ngResource',
    'angular-loading-bar'
])
.config([
    '$routeProvider',
    '$locationProvider',
    route
]);

/**
 * Implement application routing.
 * @param {object} $routeProvider - Route configuration provider.
 * @param {object} $locationProvider - Location query provider.
 */
function route($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/news',
            controller: 'newsController',
            controllerAs: 'news'
        })
        .when('/news', {
            templateUrl: newsTemplate,
            controller: 'newsController',
            controllerAs: 'news'
        })
        .when('/articles', {
            templateUrl: articlesTemplate,
            controller: 'articlesController',
            controllerAs: 'articles'
        })
        .when('/projects', {
            templateUrl: projectsTemplate,
            controller: 'projectsController',
            controllerAs: 'projects'
        })
        .when('/about', {
            templateUrl: aboutTemplate,
            controller: 'aboutController',
            controllerAs: 'about'
        })
        .otherwise({
            redirectTo: '/'
        });
    
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
        rewriteLinks: true
    });
}

/*
 * News view.
 * @param {object} params - Route parameters.
 * @returns The template Uri.
 */
function newsTemplate(params) {
    if (params.story || params.page) {
        return 'views/news?' +
            (params.story ? 'story=' + params.story : '') +
            (params.page ? 'page=' + params.page : '');
    } else {
        return 'views/news';
    }    
}

/*
 * Articles view.
 * @param {object} params - Route parameters.
 * @returns The template Uri.
 */
function articlesTemplate(params) {
    return 'views/articles' +
        (params.article ? '?article=' + params.article : '');
}

/*
 * Projects view.
 * @param {object} params - Route parameters.
 * @returns The template Uri.
 */
function projectsTemplate(params) {
    return 'views/projects' +
        (params.project ? '?project=' + params.project : '');
}

/*
 * About view.
 * @param {object} params - Route parameters.
 * @returns The template Uri.
 */
function aboutTemplate(params) {
    return 'views/about' +
        (params.event ? '?event=' + params.event : '');
}