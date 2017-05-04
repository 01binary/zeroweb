/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that displays article date selector.
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var weekDays = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// TODO: tag-page-footer to have a tip with summary for the entire month
// TODO: tag-block to have a tip with summary for the tag

/**
 * Register date selector directive.
 */
angular.module('zeroApp')
    .directive('dateselector', [
        '$q',
        '$http',
        '$compile',
        '$window',
        'render2d',
        'safeApply',
        'contrib',
        dateSelectorDirective
    ]);

/**
 * Implement date selector directive.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $window - The Angular window service.
 * @param {object} $render2d - The 2d rendering service.
 * @param {object} $safeApply - The safe apply service.
 * @param {object} $contrib - The contributions factory.
 */
function dateSelectorDirective($q, $http, $compile, $window, $render2d, $safeApply, $contrib) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<section class="date-selector" data-ng-class="{loading:isLoading}" aria-labelledby="dateSelectorCaption"></section>',
        scope: {},
        link: function($scope, $element, attributes) {
            initialize($q, $http, $compile, $window, $render2d, $safeApply, $contrib, $scope, $element, attributes);
        }
    };
}

/**
 * Initialize the date selector.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $window - The Angular window service.
 * @param {object} $render2d - The 2d rendering service.
 * @param {object} $safeApply - The safe apply service.
 * @param {object} $contrib - The contributions factory.
 * @param {object} $scope - The directive scope.
 * @param {object} $element - The directive element.
 * @param {object} attributes - The directive element attributes.
 */
function initialize($q, $http, $compile, $window, $render2d, $safeApply, $contrib, $scope, $element, attributes) {
    // Set initial state.
    $scope.isLoading = true;
    $scope.isExpanded = true;
    $scope.isScrolling = false;
    $scope.scrollOffset = 0;
    $scope.scrollInit = 0;
    $scope.minScroll = 0;
    $scope.maxScroll = 0;
    $scope.bracketWidth = 4;
    $scope.view = null;
    $scope.pages = null;
    $scope.contributions = {};
    $scope.visiblePages = [];
    $scope.maxVisibleSlots = 16;
    $scope.currentPage = attributes.page || '1';
    $scope.nextPage = null;
    $scope.prevPage = null;
    $scope.isSeparator = isSeparator;
    $scope.expandCollapse = expandCollapse.bind($element, $scope, $safeApply);
    $scope.selectNextPage = selectNextPage.bind($element, $scope);
    $scope.selectPrevPage = selectPrevPage.bind($element, $scope);
    $scope.selectPage = selectPage.bind($element, $scope);
    $scope.pageClick = pageClick.bind($element, $scope);
    $scope.beginScroll = beginScroll.bind($element, $scope);
    $scope.endScroll = endScroll.bind($element, $scope);
    $scope.doScroll = doScroll.bind($element, $scope);
    $scope.renderTags = renderTags.bind($element, $scope);
    $scope.scrollTagView = scrollTagView.bind($element, $scope);
    $scope.resize = resize.bind($element, $scope, $safeApply);

    var $tempPage = $('<div class="date-selector-page"></div>').appendTo($('body'));
    $scope.buttonWidth = $tempPage.outerWidth();
    $tempPage.remove();

    // Load content.
    $contrib.get({ type: 'story'}, function(result) {
        $scope.contributions = result;
        $scope.isLoading = false;

        // Create child elements.
        $element.append($(
            // Background rectangle.
            '<div class="date-selector-background"></div>' +

            // Embedded resources.
            // Note: geometry is needlessly repeated with different fill styles to fix Firefox stylesheet URL bug.
            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">' +
                '<defs>' +
                    '<linearGradient id="page-button-gradient" style="display:block" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="30">' +
                        '<stop offset="0" style="stop-color:rgb(249,249,249)"/>' +
                        '<stop offset="1" style="stop-color:rgb(235,235,235)"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="page-button-gradient-hover" style="display:block" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="50">' +
                        '<stop offset="0" style="stop-color:rgb(255,255,255)"/>' +
                        '<stop offset="1" style="stop-color:rgb(249,249,249)"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="page-button-gradient-pushed" style="display:block" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="30">' +
                        '<stop offset="0" style="stop-color:rgb(102,102,102)"/>' +
                        '<stop offset="1" style="stop-color:rgb(137,137,137)"/>' +
                    '</linearGradient>' +
                '</defs>' +
                // Page button resources.
                '<symbol id="page-button-border">' +
                    '<polyline stroke="currentColor" points="2.9,25.5 8.5,19.9 8.5,1.5 33.5,1.5"/>' +
                    '<polyline points="33.5,2 33.5,19.1 27.1,25.5 1.8,25.5"/>' +
                '</symbol>' +
                '<symbol id="page-button-outline">' +
                    '<polygon fill="none" points="27.5,26.5 34.5,19.5 34.5,0.5 7.5,0.5 7.5,19.5 0.5,26.5">' +
                '</symbol>' +
                '<symbol id="page-button-background">' +
                    '<polygon fill="url(#page-button-gradient)" stroke="none" points="27.5,26.5 34.5,19.5 34.5,0.5 7.5,0.5 7.5,19.5 0.5,26.5">' +
                '</symbol>' +
                '<symbol id="page-button-hover-overlay">' +
                    '<polygon fill="url(#page-button-gradient-hover)" stroke="none" points="27.5,26.5 34.5,19.5 34.5,0.5 7.5,0.5 7.5,19.5 0.5,26.5">' +
                '</symbol>' +
                '<symbol id="page-button-pushed-background">' +
                    '<polygon fill="url(#page-button-gradient-pushed)" stroke="none" points="27.5,26.5 34.5,19.5 34.5,0.5 7.5,0.5 7.5,19.5 0.5,26.5">' +
                '</symbol>' +
                '<symbol id="page-button-focus-outline">' +
                    '<polygon points="2.5,28.5 1.8,26.8 8.5,20.1 8.5,1.5 9.5,0.5 36.5,0.5 37.5,1.5 37.5,20.9 29.9,28.5 	"/>' +
                '</symbol>' +
                // Left scroll button resources.
                '<symbol id="left-scroll-button-focus-outline">' +
                    '<polyline points="0.5,28 0.5,8.1 8.1,0.5 31,0.5 31.5,1 31.5,20.9 23.9,28.5 1,28.5"/>' +
                '</symbol>' +
                '<symbol id="left-scroll-button-outline">' +
                    '<polygon fill="none" points="7.5,0.5 0.5,7.5 0.5,26.5 22.5,26.5 29.5,19.5 29.5,0.5">' +
                '</symbol>' +
                '<symbol id="left-scroll-button-border">' +
                    '<polyline stroke="currentColor" points="1.5,25 1.5,7.9 7.9,1.5 29,1.5"/>' +
                    '<polyline points="28.5,2 28.5,19.1 22.1,25.5 1,25.5"/>' +
                '</symbol>' +
                '<symbol id="left-scroll-button-background">' +
                    '<polygon fill="url(#page-button-gradient)" stroke="none" points="7.5,0.5 0.5,7.5 0.5,26.5 22.5,26.5 29.5,19.5 29.5,0.5">' +
                '</symbol>' +
                '<symbol id="left-scroll-button-pushed-background">' +
                    '<polygon fill="url(#page-button-gradient-pushed)" stroke="none" points="7.5,0.5 0.5,7.5 0.5,26.5 22.5,26.5 29.5,19.5 29.5,0.5">' +
                '</symbol>' +
                '<symbol id="left-scroll-button-hover-overlay">' +
                    '<polygon fill="url(#page-button-gradient-hover)" stroke="none" points="7.5,0.5 0.5,7.5 0.5,26.5 22.5,26.5 29.5,19.5 29.5,0.5">' +
                '</symbol>' +
                // Arrows and brackets.
                '<symbol id="arrow-left">' +
                    '<path fill="currentColor" d="M0,3.5l3.1-3.1h1.5L2.1,3H11v1H2.1l2.5,2.5H3.1L0,3.5z"/>' +
                '</symbol>' +
                '<symbol id="arrow-right">' +
                    '<path fill="currentColor" d="M7.9,6.6H6.4L8.9,4H0.2V3h8.8L6.4,0.4h1.5L11,3.5L7.9,6.6z"/>' +
                '</symbol>' +
                '<symbol id="left-bracket">' +
                    '<polygon points="10,4 10,0 4,0 0,0 0,41 4,41 10,41 10,37 4,37 4,4"/>' +
                '</symbol>' +
                '<symbol id="right-bracket">' +
                    '<polygon points="0,4 0,0 6,0 10,0 10,41 6,41 0,41 0,37 6,37 6,4"/>' +
                '</symbol>' +
            '</svg>' +

            // Expand/collapse heading.
            '<button id="dateSelectorCaption" class="date-selector-caption button-inline noselect" aria-label="Articles by date (expand or collapse)" data-ng-click="expandCollapse()">' +
                '{{isExpanded === true ? "- by date" : "+"}}' +
            '</button>' +

            // Previous page button.
            '<a data-ng-href="/news?page={{prevPage}}" role="button" tabindex="0" class="date-selector-scroll date-selector-scroll-left noselect" data-ng-click="selectPrevPage()">' +
                '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-hover-overlay"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-pushed-background"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-outline" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-outline"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-focus-outline" width="38" height="30" viewBox="0 0 38 30">' +
                    '<use xlink:href="#left-scroll-button-focus-outline"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-border" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-border"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-border-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-border"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-background" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-background"></use>' +
                '</svg>' +
                '<div class="date-selector-page-label">' +
                    '<svg width="11" height="7" viewBox="0 0 11 7">' +
                        '<use xlink:href="#arrow-left"></use>' +
                    '</svg>' +
                '</div>' +
            '</a>' +

            // Pages strip.
            '<div class="date-selector-pages">' + 
                // Page button.
                '<a role="button" ' +
                    'data-ng-href="/news?page={{page}}" ' + 
                    'ng-attr-tabindex="{{isSeparator(page) ? -1 : 0}}" ' +
                    'class="date-selector-page noselect" ' +
                    'data-ng-mousedown="pageClick($event)" ' +
                    'data-ng-repeat="page in visiblePages" ' +
                    'data-ng-class="{' +
                        '\'date-selector-page-separator\': isSeparator(page), ' +
                        '\'selected\': page === currentPage ' +
                    '}">' +
                    '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-hover-overlay"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-pushed-background"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-focus-outline" width="38" height="29" viewBox="0 0 38 29">' +
                        '<use xlink:href="#page-button-focus-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-outline" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-border" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-border"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-border-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-border"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-background" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-background"></use>' +
                    '</svg>' +
                    '<div class="date-selector-page-label">' +
                        '<span class="date-selector-page-fallback">page</span>' +
                        '<div class="date-selector-page-number">{{page}}</div>' +
                    '</div>' +
                '</a>' +

                // Next page button.
                // (has to be inside pages container to follow last page button).
                '<a data-ng-href="news/?page={{nextPage}}" role="button" tabindex="0" class="date-selector-scroll date-selector-scroll-right noselect" data-ng-click="selectNextPage()">' +
                    '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-hover-overlay"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-pushed-background"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-outline" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-focus-outline" width="38" height="29" viewBox="0 0 38 29">' +
                        '<use xlink:href="#page-button-focus-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-border" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-border"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-border-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-border"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-background" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-background"></use>' +
                    '</svg>' +
                    '<div class="date-selector-page-label">' +
                        '<svg class="date-selector-scroll-label" width="11" height="7" viewBox="0 0 11 7">' +
                            '<use xlink:href="#arrow-right"></use>' +
                        '</svg>' +
                    '</div>' +
                '</a>' +
            '</div>' +

            // Tag view.
            '<div class="date-selector-view" ' +
                'data-ng-mousedown="beginScroll($event)">' +
            '</div>'
        ));

        // Initialize the tag view.
        $scope.view = $element.find('.date-selector-view');
        $scope.pages = $element.find('.date-selector-pages');

        if ($scope.contributions.max) {
            $scope.renderTags($render2d);
            $scope.selectPage($scope.currentPage);

            $($window).on('resize', $scope.resize);
        }

        // Compile the template.
        $compile($element)($scope);
    });
}

/**
 * Expand or collapse the custom control.
 * @param {object} $scope - The directive scope.
 * @param {object} $safeApply - The safe apply service.
 */
function expandCollapse($scope, $safeApply) {
    if (!$scope.isExpanded) {
        this.removeClass('collapsed');
    }

    this.stop()
        .animate({
            height: $scope.isExpanded ? 32 : 130

        }, 'fast', function() {
            $safeApply($scope, function() {
                $scope.isExpanded = !$scope.isExpanded;

                if (!$scope.isExpanded) {
                    this.addClass('collapsed');
                }
            }.bind(this));
        }.bind(this));
}

/**
 * Scroll to next page.
 * @param {object} $scope - The directive scope.
 */
function selectPrevPage($scope) {
    var prev = parseInt($scope.currentPage, 10) - 1;

    if (prev < 1)
        return;

    $scope.selectPage(prev);
}

/**
 * Scroll to previous page.
 * @param {object} $scope - The directive scope.
 */
function selectNextPage($scope) {
    var next = parseInt($scope.currentPage, 10) + 1;

    if (next > $scope.contributions.pages.length) {
        return;
    }

    $scope.selectPage(next);
}

/**
 * Begin continuous scrolling.
 * @param {object} $scope - The directive scope.
 * @param {object} $event - The Angular mouse down event.
 */
function beginScroll($scope, $event) {
    if (!$scope.maxScroll) {
        return;
    }

    document.body.style['pointer-events'] = 'none';
    document.addEventListener('mouseup', $scope.endScroll, { capture: true });
    document.addEventListener('mousemove', $scope.doScroll, { capture: true });

    $('html').addClass('scrolling');

    $scope.isScrolling = true;
    $scope.scrollOffset = $event.pageX;
    $scope.scrollInit = parseInt($scope.view.css('left'), 10);

    $event.preventDefault();
    $event.stopPropagation();
}

/**
 * Process continuous scrolling.
 * @param {object} $scope - The directive scope.
 * @param {object} $event - The mouse move event.
 */
function doScroll($scope, $event) {
    if ($scope.isScrolling) {
        var target = $event.pageX - $scope.scrollOffset;

        if ($scope.scrollInit)
            target += $scope.scrollInit;

        if (target < -$scope.maxScroll) {
            target = -$scope.maxScroll
        } else if (target > $scope.minScroll) {
            target = $scope.minScroll;
        }

        $scope.view.css('left', target + 'px');
    }
}

/**
 * Complete continuous scrolling.
 * @param {object} $scope - The directive scope.
 * @param {object} $event - The mouse up event.
 */
function endScroll($scope, $event) {
    document.body.style['pointer-events'] = 'auto';
    document.removeEventListener('mouseup', $scope.endScroll);
    document.removeEventListener('mousemove', $scope.doScroll);

    $scope.isScrolling = false;

    $('html').removeClass('scrolling');

    $event.stopPropagation();
}

/**
 * Page button click.
 * @param {object} $scope - The directive scope.
 * @param {object} event - The Angular event arguments.
 */
function pageClick($scope, event) {
    var page = $(event.target)
        .closest('.date-selector-page')
        .find('.date-selector-page-number')
        .text();

    if (parseInt(page, 10))
        $scope.selectPage(page);
}

/**
 * Get the captions for visible page buttons.
 * @param {object} $element - jQuery of the directive element.
 * @param {object} $scope - The directive scope.
 * @returns - The array of visible pages to render.
 */
function getVisiblePages($element, $scope) {
    // Calculate page element sizes.
    var stripWidth = $element.innerWidth();

    // Reserved slots for 1 break view - ... and ->
    var reservedSlots1Break = 2;

    // Reserved slots for 2 break view - 2x ... and ->
    var reservedSlots2Break = 4;

    // Calculate visible pages for 1- and 2-break views.
    var currentPage = parseInt($scope.currentPage);
    var totalPages = $scope.contributions.pages.length;
    var totalVisibleSlots = Math.ceil(stripWidth / $scope.buttonWidth);

    var maxVisibleSlots1Break = Math.min(totalPages + reservedSlots1Break, $scope.maxVisibleSlots);
    var visibleSlots1Break = Math.min(maxVisibleSlots1Break, totalVisibleSlots);

    var maxVisibleSlots2Break = Math.min(totalPages + reservedSlots2Break, $scope.maxVisibleSlots);
    var visibleSlots2Break = Math.min(maxVisibleSlots2Break, totalVisibleSlots);

    // Calculate visible pages for a 1-break view.
    var halfVisibleSlots = Math.floor((visibleSlots1Break - reservedSlots1Break) / 2);
    var pagesBeforeBreak = halfVisibleSlots;
    var pagesAfterBreak = halfVisibleSlots;
    var pageNumbersArray = null;

    if (pagesBeforeBreak + pagesAfterBreak + reservedSlots1Break < visibleSlots1Break) {
        pagesBeforeBreak++;
    }
    
    // Calculate the number of page slots in the middle break (if using a 2-break view).
    var pagesMiddleBreak = visibleSlots2Break - reservedSlots2Break - 1;

    // Calculate the range of current page before middle break is scrolled by one left or right.
    var middleBreakGroupCount = Math.max(1, pagesMiddleBreak - 2);

    // Calculate the first page in the middle break.
    var firstPage = Math.floor((currentPage - pagesBeforeBreak) / middleBreakGroupCount) *
        middleBreakGroupCount + pagesBeforeBreak - 1;

    if (totalPages + 1 <= totalVisibleSlots) {
        // Allocate the visible page slots.
        pageNumbersArray = new Array(totalPages - 1);

        // Display all pages with no breaks.
        for(var n = 0; n < totalPages; n++) {
            pageNumbersArray[n] = (n + 1).toString();
        }
    } else if (currentPage >= pagesBeforeBreak && currentPage < totalPages - pagesAfterBreak) {
        // Allocate the visible page slots (-1 for -> button, -1 for last element instead of count).
        var lastSlot = visibleSlots2Break - 2;

        if (lastSlot <= 0) {
            return [];
        }

        pageNumbersArray = new Array(lastSlot);

        // Calculate page slots for a 2-break view.
        // <- 1 ... X X X X ... n ->
        pageNumbersArray[0] = '1';
        pageNumbersArray[1] = '...';

        if (pagesMiddleBreak === 1) {
            pageNumbersArray[2] = $scope.currentPage;
        } else {
            for (var n = 2; n < visibleSlots2Break - 3; n++) {
                pageNumbersArray[n] = (n - 2 + firstPage).toString();
            }
        }

        pageNumbersArray[visibleSlots2Break - 3] = '... ';
        pageNumbersArray[visibleSlots2Break - 2] = totalPages.toString();
    } else if (currentPage >= totalPages - pagesAfterBreak - 1) {
        // Allocate the visible page slots (-1 for -> button, -1 for last element instead of count).
        var lastSlot = visibleSlots1Break - 2;

        if (lastSlot <= 0) {
            return [];
        }

        var startPage = totalPages - lastSlot + 2;

        pageNumbersArray = new Array(lastSlot);
        pageNumbersArray[0] = '1';
        pageNumbersArray[1] = '...';

        // Calculate page slots for a 1-break end view.
        // <- 1 ... n-3 n-2 n-1 n ->
        for (var n = 2; n <= lastSlot; n++) {
            pageNumbersArray[n] = (n - 2 + startPage).toString();
        }
    } else {
        // Allocate the visible page slots (including breaks but excluding -> button).
        pageNumbersArray = new Array(visibleSlots1Break - 2);

        // Calculate page slots for a 1-break view.
        // <- 1 2 3 4 ... n-2 n-1 n ->
        pageNumbersArray[pagesBeforeBreak] = '...';

        for (var n = 0; n < pagesBeforeBreak; n++) {
            pageNumbersArray[n] = (n + 1).toString();

            if (n < pagesAfterBreak) {
                pageNumbersArray[n + pagesBeforeBreak + 1] =
                    (totalPages - pagesAfterBreak + n + 1).toString();
            }
        }
    }

    return pageNumbersArray;
}

/**
 * Determine whether the page is a separator by its caption.
 * @param {string} page - The page caption.
 */
function isSeparator(page) {
    return page.indexOf('.') !== -1;
}

/**
 * Update model and markup when changing the displayed page.
 * @param {object} $scope - The directive scope.
 * @param {string} page - The page number or caption to change to.
 */
function selectPage($scope, page) {
    // Update the page numbers.
    var pageIndex = parseInt($scope.currentPage, 10) - 1;

    $scope.currentPage = page.toString();
    $scope.prevPage = Math.max(1, pageIndex).toString();
    $scope.nextPage = Math.min($scope.contributions.pages.length, pageIndex + 2).toString();
    $scope.visiblePages = getVisiblePages($scope.pages, $scope);

    // Update the selection brackets.
    var page = $scope.contributions.pages[pageIndex];
    var months = Object.keys($scope.contributions.months);

    var startMonthIndex = months.indexOf(page.start.month);
    var startWeekIndex = page.start.week;
    var endMonthIndex = months.indexOf(page.end.month);
    var endWeekIndex = page.end.week;

    var $allWrappers = this.find('.tag-page');
    var $startWrapper = $($allWrappers.get(startMonthIndex));
    var $endWrapper = $($allWrappers.get(endMonthIndex));
    var $startBar = $($startWrapper.find('.tag-bar').get(startWeekIndex));
    var $endBar = $($endWrapper.find('.tag-bar').get(endWeekIndex));

    var selectionStart = $startWrapper.position().left +
        $startBar.position().left - 4;
    var selectionEnd = $endWrapper.position().left +
        $endBar.position().left + $endBar.width() - 8;

    this.find('.tag-page-bracket-left')
        .stop()
        .animate({ left: selectionStart + 'px' })
    this.find('.tag-page-bracket-right')
        .stop()
        .animate({ left: selectionEnd + 'px' }); 
    this.find('.tag-page-underline-mask')
        .stop()
        .css('width', selectionEnd - selectionStart +
            50 + (endWeekIndex === 3 ? 6 : 0))
        .animate({ left: selectionStart - 21});

    $scope.scrollTagView(
        $startWrapper.position().left - $scope.minScroll,
        $endWrapper.position().left + $endWrapper.width() + $scope.minScroll + 1);
}

/**
 * Render tags.
 * @param {object} $scope - The directive scope.
 * @param {object} $render2d - The 2d rendering service.
 */
function renderTags($scope, $render2d) {
    var $view = $scope.view;
    var monthMargin = null;
    var barHeight = null;
    var minBlockHeight = null;
    var $wrapper = null;
    
    // Render month wrappers.
    for (var monthName in $scope.contributions.months) {
         var monthSummary = $scope.contributions.months[monthName];

        $wrapper = $('<div class="tag-page noselect"></div>')
            .css('left', $wrapper ?
                $wrapper.position().left + $wrapper.width() + monthMargin : $scope.bracketWidth)
            .append($('<div class="tag-page-footer noselect"></div>')
                .text(monthName))
            .append($('<div class="tag-page-separator"></div>'))
            .appendTo($view);

        if (!monthMargin) {
            monthMargin = parseInt($wrapper.css('margin-right'));
        }
        
        // Render week bars inside of the month wrapper.
        for (var weekDates in monthSummary.weeks) {
             var weekSummary = monthSummary.weeks[weekDates];
             var tagOffset = 0;
             var weekId = 'week-' + weekDates.replace(/\s/g, '');
             var $bar = $('<div class="tag-bar"></div>')
                .appendTo($wrapper);
            
            $bar.css('left', $wrapper.width() - $bar.width() * (weekSummary.offset + 1) + 2);

            if (!barHeight) {
                barHeight = $bar.height();
            }

            // Render stacked tag blocks inside of bars for each week.
            for (var tag in weekSummary.tags) {
                 var tagCount = weekSummary.tags[tag];
                 var tagHeight = Math.round((tagCount / $scope.contributions.max) * barHeight);
                 var $block = $('<div class="tag-block tag-' + tag + '"></div>')
                    .css('height', tagHeight + 'px')
                    .css('bottom', tagOffset + 'px')
                    .appendTo($bar);

                if (!minBlockHeight) {
                    minBlockHeight = parseInt($block.css('min-height'));
                }

                tagOffset += Math.max(minBlockHeight, tagHeight) + 1;
            }

            // Set week tooltip attributes (resolved when view is compiled).
            $bar.attr('data-tooltip', '#' + weekId);
            $bar.attr('data-tooltip-offset-y', Math.ceil(tagOffset - minBlockHeight * 2 + 1));

            // Render the week tooltip.
            renderWeekTip(
                 $('<div id="' + weekId + '" class="tag-bar-tip"></div>').appendTo($view),
                weekDates,
                weekSummary,
                $render2d)
        }
    }

    // Render selection brackets and the underline mask.
    $view.append($(
        '<svg class="tag-page-bracket-left noselect" width="41" height="52" viewBox="0 0 41 49">' +
            '<use xlink:href="#left-bracket">' +
        '</svg>' +
        '<svg class="tag-page-bracket-right noselect" width="41" height="52" viewBox="0 0 41 49">' +
            '<use xlink:href="#right-bracket">' +
        '</svg>' +
        '<div class="tag-page-underline-mask noselect"></div>'));

    if ($wrapper) {
        // Calculate range for interactive scrolling.
        $scope.minScroll = parseInt($view.css('left'));
        $scope.maxScroll = calculateMaxScroll($scope);

        // Start with tag view off-screen for a slide-in animation.
        if ($scope.currentPage == "1") {
            $view.css('left', -$view.width() + 'px');
        }
    }
}

/**
 * Renders the week bar tooltip.
 * @param {Object} $tip - The tip element jQuery, already created.
 * @param {string} weekName - The week name in 'MMM dd - MMM dd' format.
 * @param {Object} weekSummary - The week summary with tags, articles, and max tags.
 * @param {Object} $render2d - The 2d rendering service.
 */
function renderWeekTip($tip, weekName, weekSummary, $render2d) {
    var width = 250;
    var height = 32;
    var dayWidth = Math.round(width / 7);
    var halfDayWidth = Math.round(dayWidth / 2);
    var footerHeight = 22;
    var sampleSize = 3;
    var sampleLabelSize = 10;
    var halfSampleSize = Math.round(sampleSize / 2);
    var plotMultiplier = height - footerHeight;
    var plotOffset = footerHeight;
    var startDayOffset = sampleSize + halfDayWidth
    var dayOffset = startDayOffset;
    var prevOffset, prevProjection;
    var graph = '';
    var projected = new Array(7);

    // Render graph.
    for (var dayIndex = 0; dayIndex < weekDays.length; dayIndex++) {
        var day = weekDays[dayIndex];
        var daySummary = weekSummary.days[day];
        var daySample = daySummary ? daySummary / weekSummary.max : 0;
        var dayText = daySummary || '';

        projected[dayIndex] = Math.round(
            height - daySample * plotMultiplier - plotOffset + sampleSize + 1);

        // Render day label.
        graph += '<text class="tag-days__day-label" x="' +
            dayOffset +
            '" y="' +
            (height - 1) +
            '" text-anchor="middle" alignment-baseline="bottom">' +
            day +
            '</text>';

        // Render line connecting day samples.
        if (dayIndex) {
            graph += '<line x1="' +
                prevOffset +
                '" x2="' +
                dayOffset +
                '" y1="' +
                projected[dayIndex - 1] +
                '" y2="' +
                projected[dayIndex]
                + '" />';
        }

        prevOffset = dayOffset;
        dayOffset += dayWidth;
    }

    dayOffset = startDayOffset;

    for (var dayIndex = 0; dayIndex < weekDays.length; dayIndex++) {
        var dayProjection = projected[dayIndex];

        // Render day sample.
        graph += '<ellipse class="tag-days__sample" cx="' +
            dayOffset +
            '" cy="' +
            dayProjection +
            '" rx="' + sampleSize +
            '" ry="' + sampleSize +
            '" />';

        prevOffset = dayOffset;
        dayOffset += dayWidth;
    }

    $tip.append($(
        '<h4><span>' + weekName + '</span></h4>' +
        '<svg class="tag-days" width="' + width + '" height="' + height + '">' +
            graph +
        '</svg>' +
        '<ul class="tag-list"></ul>' +
        '<ul class="tag-article-list"></ul>'
    ));

    // Render tags.
    var $tagsList = $tip.find('.tag-list');
    var tags = Object.keys(weekSummary.tags);

    for (var tagIndex = 0; tagIndex < tags.length; tagIndex++) {
        var tagName = tags[tagIndex];
        var tagCount = weekSummary.tags[tagName];

        $('<li>' +
            '<div class="tag-' + tagName + '">' +
            '</div>' +
            tagCount + ' ' +
            '<span>&times;</span> ' +
            tagName.replace('-', ' <span>&#8594;</span> ') +
        '</li>').appendTo($tagsList);
    }

    // Render articles.
    var $articlesList = $tip.find('.tag-article-list');

    for (var articleIndex = 0;
        articleIndex < weekSummary.articles.length;
        articleIndex++) {
        $('<li><span>' + weekSummary.articles[articleIndex] + '</span></li>')
            .appendTo($articlesList);
    }
}

/**
 * Calculate maximum scroll offset when dragging with mouse.
 * @param {Object} $scope - The directive scope.
 */
function calculateMaxScroll($scope) {
    var $wrapper = $scope.view.find('.tag-page').last();
    return Math.max(0,
        $wrapper.position().left +
        $wrapper.width() -
        $scope.view.width() +
        $scope.bracketWidth);
}

/**
 * Scroll visible tag range into view.
 * @param {object} $scope - The directive scope.
 * @param {number} start - The starting offset of the visible range in pixels.
 * @param {number} end - The ending offset of the visible range in pixels.
 */
function scrollTagView($scope, start, end) {
    var viewSize = $scope.view.width();
    var viewStart = parseInt($scope.view.position().left, 10) + $scope.minScroll;
    var viewEnd = viewStart + viewSize;
    var target = $scope.minScroll;

    if (start < viewStart) {
        target = -start + $scope.minScroll;
    } else if (end > viewEnd) {
        target = -(end - viewEnd) - $scope.bracketWidth - $scope.minScroll + 1;
    }

    var delta = Math.abs(target - viewStart);

    if (target > $scope.minScroll) {
        target = $scope.minScroll;
    } else if (delta < 10) {
        return;
    }

    var duration = Math.max(500, delta / 4 * 10);

    $scope.view.stop().animate({
        left: target + 'px'
    }, duration);
}

/**
 * Resize the tag view.
 * @param {object} $safeApply - The safe apply service.
 * @param {object} $scope - The directive scope.
 */
function resize($scope, $safeApply) {
    $safeApply($scope, function() {
        $scope.maxScroll = calculateMaxScroll($scope);
        $scope.selectPage($scope.currentPage);
    });
}