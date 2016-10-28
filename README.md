# zeroweb
01 binary website

## Summary

A working website prototype using ASP.net core to render layout page and partials, and Angular to make the site more interactive by attaching Angular controllers to Views returned from ASP.net controllers.

## Setup

- Visual Studio Code is recommended for opening this folder
- `npm install` to restore both Node.js and .NET packages
- `dotnet user-secrets set *key* *value*` to set the following keys (optional):
   - facebookId, facebookSecret
   - twitterId, twitterSecret
   - microsoftId, microsoftSecret
   - githubId, githubSecret
   - googleId, googleSecret
   - linkedInId, linkedInSecret
   - redditId, redditSecret
   - yahooId, yahooSecret
- `npm start` to start ASP.net Core engine (or click Run in VSCode)
- Navigate to https://localhost:5001/ if not running in VSCode

## Development

- `npm run build` to rebuild
- `npm run build sass` or `npm run sass` to rebuild styles
- `npm run build uglify` or `npm run uglify` to rebuild scripts
- `npm run watch` to watch styles and scripts and rebuild on change
- `npm run watch sass` or `npm sass:watch` to watch and rebuild styles
- `npm run watch uglify` or `npm uglify:watch` to watch and rebuild scripts
- `npm run database update` to apply migrations and create the site database
- `npm run migrations add` to record a new migration after modifying models
- `npm run migrations remove` to remove the last recorded migration
- `npm run test unit` or `npm run test` to run unit tests
- `npm run test functional` or `npm run test f` to run functional tests

### Features

####Loads inline SVG fragments with AJAX requests:
- icon elements are resolved with icon directive in scripts/app/directives/iconDirective.js
- jQuery is used to parse SVG fragments and add them to DOM
- SVG service is used to perform the actual loading in scripts/app/services/svgService.js

####Builds on top of SVG service to transform hyperlinks under navigation element into site menu with graphics and icons:
- navigation directive in scripts/app/directives/navigationDirective.js resolves into nav HTML5 element with inline svg fragments nested under each hyperlink

####Renders 2D controls using Canvas
- Headers on partial views are visually connected to corresponding site menu buttons using scripts/app/directives/pointerDirective.js

####Supports Single Page Application routing alongside ASP.net routing
- Startup page for the website is a .cshtml layout using the Startup server-side controller that also hosts the Angular application
- Angular views are .cshtml partials using respective server-side controllers
- Angular application defines client-side routes to attach Angular controllers to .cshtml partials for each views
- navigation directive handles client-side route changes to set page title in addition to changing site menu styles
- URL rewriting is employed on server side to redirect URLs rewritten by Angular to the layout .cshtml, while Angular still picks the right partial