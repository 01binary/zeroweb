# zeroweb
01 binary website

## Summary

A working website prototype before filling in Angular controllers and replacing HTML pages with ASP.net.

Loads inline SVG fragments with AJAX requests:
- icon elements are resolved with icon directive in scripts/app/directives/iconDirective.js
- hyperlink elements under navigation element are resolved with navigation directive in scripts/app/directives/navigationDirective.js which loads multiple graphics to create a navigation menu
- svg service is used to perform the actual loading in scripts/app/services/svgService.js

## Setup

- npm install to restore packages
- npm start to run gulp webserver (open the address printed by gulp-webserver in your browser)
- gulp minify or npm run min to create app script package in scripts/zero.min.js
- use index.htm as the start page