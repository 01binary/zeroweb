# zeroweb
01 binary website

## Summary

Loads inline SVG fragments with AJAX requests:
- icon elements are resolved with icon directive in app/directives/iconDirective.js
- hyperlink elements under nav element are resolved with nav directive in app/directives/navDirective.js which loads multiple graphics to create a navigation menu
- svg service is used to perform the actual loading in app/services/svgService.js

## Setup

npm install to restore packages
npm start to run gulp webserver (open the address printed by gulp-webserver in your browser)