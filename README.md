# zeroweb
01 binary website

## Summary

A working website prototype using ASP.net core to render layout page and partials, and Angular to make the site more interactive by attaching Angular controllers to Views returned from ASP.net controllers.

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

####Unit Tests
- Supports Karma for Angular unit tests (not yet written)
- Supports Protractor for Angular functional tests (not yet written)
- Pending support for .NET unit tests (not yet written)

## Setup

- Visual Studio Code is recommended for opening this folder
- `npm install` to restore Node.js packages
- `dotnet restore` to restore NuGet packages
- `dotnet ef database update` to create initial SqLite database
- `dotnet user-secrets set facebookId` to set facebook app Id for login integration
- `dotnet user-secrets set facebookSecret` to set facebook app secret
- `dotnet run` to start ASP.net Core engine (or click Run in VSCode and skip the last step)
- Navigate to http://localhost:5000/ to see the site