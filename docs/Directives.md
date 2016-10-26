# ZeroWeb Directives

Use the following directly in HTML5 or Markdown to extend page content:

## icon (element)

### example

    <icon data-src="images/vectorimage.svg">Fallback content</icon>

### summary

Replaces the element with inline <svg> fragment before content is shown.

### source

See ../Scripts/app/directives/iconDirective.js

## navigation (element)

### example

    <navigation data-src="images/symbolset.svg"><a ...><a ...><a ...></navigation>

### summary

Replaces the element with <nav> HTML5 element and loads nested <svg><use></use></svg> fragments under each <a> child.
All <use> references refer to an inline <svg> fragment loaded with AJAX and pre-pended to document body, which contains multiple <symbol> elements that can be referenced.

For each <a> under <navigation>, the following symbols are referenced from the symbol set:

- matte
- hover
- border
- highlight
- icon
- selection

The full name of the reference is in the form:

    #button_name-element_name

Where:

- button_name is the text found inside each <a></a> under <navigation>
- element_name is one of above listed elements such as "matte"

Additionally, the following CSS styles are applied to <a> elements by Angular route change handler installed by this directive:

- navigation (CSS class applied to all <a> children)
- navigation-selected (CSS class applied to <a> corresponding to current Angular route)
- navigation-unselected (CSS class applied to <a>'s not related to current route)
- navigation-last (CSS class applied to last <a> under <navigation>)
- navigation-afterselected (CSS class applied to next <a> sibling of the <a> that corresponds to current route)

### source

See ../Scripts/app/directives/navigationDirective.js

## markdown (element)

### example

    <markdown data-inline>### This is heading3!</markdown>

    <markdown>{{markdownBinding}}</markdown>

### summary

Replaces the element with a div that contains formatted text resolved using **markdown-it** parser.

Angular expressions (such as binds) are supported inside the markdown element and resolved using $compile before the parser.

### source

See ../Scripts/app/directives/markdownDirective.js

See ../Scripts/markdown-it/dist/markdown-it.js

## pointer (attribute)

### example

    <h1 data-pointer>projects</h1>

### summary

Prepends a 2d <canvas> to element this attribute is applied to, and draws an arrow pointing from navigation button corresponding to current Angular route to this element.
Commonly used on headers in partial views.

### source

See ../Scripts/app/directives/pointerDirective.js

## transition (attribute)

### example

    <body data-ng-cloak data-transition="fade">

### summary

Used on cloaked Angular containers to apply a simple transition on single page application first load. This reduces harsh effects from page blinking into existance.

### source

See ../Scripts/app/directives/transitionDirective.js

## thumbnail (attribute)

### example

    <img data-thumbnail src="..."></img>

### summary

Used on site items tagged with "story", "article", or "project" to define a thumbnail to be displayed when listing the item without displaying its full content.

### source

Not yet implemented

## step (attribute)

### example

    <h2 data-step="1">Prepare the Walrus</h2>
    <h2 data-step="2">Wash the Walrus</h2>

### summary

Used on sub-headers in site items tagged with "article" to define a tutorial that consists of discrete steps.
This could be used to display a sidebar with links to the steps, automatically create named anchors, etc.

### source

Not yet implemented.

## time (attribute)

### example

    <h2 data-step="1" data-time="00:00:30">Make a 2" cut on metal bar</h2>

### summary

Used on sub-headers in site items tagged with "article" to define a tutorial that consists of discrete steps.
This is a hint to the reader on how much time they can expect to spend on this step, and could be used to display an overlay that displays the "time offset into tutorial" as user scrolls.
For example, when user scrolls past the first two steps marked with "00:00:30" and "00:02:00" they can be shown a hint that says how much time they have left to go versus sum of all steps.

### source

Not yet implemented

## reference (attribute)

### example
    
    <a href="..." data-reference>Material safety data sheet</a>

### summary

Used on hyperlinks for site items tagged with "article" to define a reference. For example, referring reader to more information about a subject from an article on that subject.
This can be used as a hint to display a sidebar with a list of references.

### source

Not yet implemented

## prerequisite (attribute)

### example

    <a href="..." data-prerequisite>Metal sheers</a>
    <a href="..." data-prerequisite>Work gloves</a>

### summary

Used on hyperlinks for site items tagged with "article" to define a prerequisite. For example, listing items required before attempting a tutorial.
This can be used as a hint to display a sidebar with a list of prerequisite.

### source

Not yet implemented