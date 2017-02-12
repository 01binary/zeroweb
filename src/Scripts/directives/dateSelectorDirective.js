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
 
/**
 * Register date selector directive.
 */
angular.module('zeroApp')
    .directive('dateselector', [
        '$q',
        '$http',
        '$compile',
        '$window',
        'safeApply',
        dateSelectorDirective
    ]);

/**
 * Implement date selector directive.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $window - The Angular window service.
 * @param {object} $safeApply - The safe apply service.
 */
function dateSelectorDirective($q, $http, $compile, $window, $safeApply) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="date-selector" data-ng-class="{loading:isLoading}"></div>',
        scope: {},
        link: function($scope, $element, attributes) {
            initialize($q, $http, $compile, $window, $safeApply, $scope, $element);
        }
    };
}

/**
 * Initialize the date selector.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $compile - The Angular compile service.
 * @param {object} $window - The Angular window service.
 * @param {object} $safeApply - The safe apply service.
 * @param {object} $scope - The directive scope.
 * @param {object} $element - The directive element.
 */
function initialize($q, $http, $compile, $window, $safeApply, $scope, $element) {
    // Set initial state.
    $scope.isLoading = true;
    $scope.isExpanded = true;
    $scope.isScrolling = false;
    $scope.contributions = {};
    $scope.visiblePages = [];
    $scope.maxVisiblePages = 8;
    $scope.currentPage = null;

    $scope.isSeparator = isSeparator;
    $scope.expandCollapse = expandCollapse.bind($element, $scope, $safeApply);
    $scope.nextPage = nextPage.bind($element, $scope);
    $scope.prevPage = prevPage.bind($element, $scope);
    $scope.selectPage = selectPage.bind($element, $scope);
    $scope.pageClick = pageClick.bind($element, $scope);
    $scope.beginScroll = beginScroll.bind($element, $scope);
    $scope.endScroll = endScroll.bind($element, $scope);
    $scope.doScroll = doScroll.bind($element, $scope);
    $scope.renderTags = renderTags.bind($element, $scope);

    // Load content.
    loadContent($q, $http, $scope).then(function() {
        // Create child elements.
        $element.append($(
            // Background rectangle.
            '<div class="date-selector-background"></div>' +

            // Embedded resources.
            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">' +
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
                '<symbol id="page-button-border">' +
                    '<polyline stroke="currentColor" points="2.9,25.5 8.5,19.9 8.5,1.5 33.5,1.5"/>' +
                    '<polyline points="33.5,2 33.5,19.1 27.1,25.5 1.8,25.5"/>' +
                '</symbol>' +
                '<symbol id="page-button-outline">' +
                    '<polygon points="27.5,26.5 34.5,19.5 34.5,0.5 7.5,0.5 7.5,19.5 0.5,26.5">' +
                '</symbol>' +
                '<symbol id="left-scroll-button-border">' +
                    '<polyline stroke="currentColor" points="1.5,25 1.5,7.9 7.9,1.5 29,1.5"/>' +
                    '<polyline points="28.5,2 28.5,19.1 22.1,25.5 1,25.5"/>' +
                '</symbol>' +
                '<symbol id="left-scroll-button-outline">' +
                    '<polygon points="7.5,0.5 0.5,7.5 0.5,26.5 22.5,26.5 29.5,19.5 29.5,0.5">' +
                '</symbol>' +
                '<symbol id="arrow-left">' +
                    '<path fill="currentColor" d="M0,3.5l3.1-3.1h1.5L2.1,3h8.8V4H2.1l2.5,2.5H3.1L0,3.5z"/>' +
                '</symbol>' +
                '<symbol id="arrow-right">' +
                    '<path fill="currentColor" d="M7.9,6.6H6.4L8.9,4H0.2V3h8.8L6.4,0.4h1.5L11,3.5L7.9,6.6z"/>' +
                '</symbol>' +
                '<symbol id="left-bracket">' +
                    '<polygon points="10,4 10,0 4,0 0,0 0,45 4,45 10,45 10,41 4,41 4,4"/>' +
                '</symbol>' +
                '<symbol id="right-bracket">' +
                    '<polygon points="0,4 0,0 6,0 10,0 10,45 6,45 0,45 0,41 6,41 6,4"/>' +
                '</symbol>' +
            '</svg>' +

            // Previous page button.
            '<a role="button" class="date-selector-scroll date-selector-scroll-left noselect" data-ng-click="prevPage()">' +
                '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-outline"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-outline"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-outline" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-outline"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-border" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-border"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-border-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-border"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-background" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-outline"></use>' +
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
                '<a role="button" class="date-selector-page noselect" ' +
                    'data-ng-mousedown="pageClick($event)" ' +
                    'data-ng-repeat="page in visiblePages" ' +
                    'data-ng-class="{' +
                        '\'date-selector-page-separator\': isSeparator(page), ' +
                        '\'selected\': page === currentPage ' +
                    '}">' +
                    '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
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
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<div class="date-selector-page-label">' +
                        '<span class="date-selector-page-fallback">page</span>' +
                        '<div class="date-selector-page-number">{{page}}</div>' +
                    '</div>' +
                '</a>' +

                // Next page button.
                // (has to be inside pages container to follow last page button).
                '<a role="button" class="date-selector-scroll date-selector-scroll-right noselect" data-ng-click="nextPage()">' +
                    '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
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
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<div class="date-selector-page-label">' +
                        '<svg class="date-selector-scroll-label" width="11" height="7" viewBox="0 0 11 7">' +
                            '<use xlink:href="#arrow-right"></use>' +
                        '</svg>' +
                    '</div>' +
                '</a>' +
            '</div>' +

            // Expand/collapse heading.
            '<button class="date-selector-caption button-inline noselect" data-ng-click="expandCollapse()" data-tooltip="// expand or collapse">' +
                '{{isExpanded === true ? "- by date" : "+"}}' +
            '</button>' +

            // Tag view.
            '<div class="date-selector-view" ' +
                'data-ng-mousedown="beginScroll($event)">' +
            '</div>'
        ));

        // Compile the template.
        $compile($element)($scope);

        // Initialize the view.
        $scope.view = $('.date-selector-view');

        if ($scope.contributions.max) {
            $scope.renderTags();
            $scope.selectPage('1');
        }
    });
}

/**
 * Expand or collapse the custom control.
 * @param {object} $scope - The directive scope.
 * @param {object} $safeApply - The safe apply service.
 */
function expandCollapse($scope, $safeApply) {
    var $element = this;

    if (!$scope.isExpanded) {
        $element.removeClass('collapsed');
    }

    this.find('.date-selector-background')
        .stop()
        .animate({
            opacity: $scope.isExpanded ? 0 : 1
        }, 'fast', function() {
            $safeApply($scope, function() {
                $scope.isExpanded = !$scope.isExpanded;

                if (!$scope.isExpanded) {
                    $element.addClass('collapsed');
                }
            });
        });
}

/**
 * Scroll to next page.
 * @param {object} $scope - The directive scope.
 */
function prevPage($scope) {
    var prev = parseInt($scope.currentPage, 10) - 1;

    if (prev < 1)
        return;

    $scope.selectPage(prev);
}

/**
 * Scroll to previous page.
 * @param {object} $scope - The directive scope.
 */
function nextPage($scope) {
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
    document.body.style['pointer-events'] = 'none';
    document.addEventListener('mouseup', $scope.endScroll, { capture: true });
    document.addEventListener('mousemove', $scope.doScroll, { capture: true });

    $scope.scrolling = true;
    $scope.scrollOffset = $event.pageX;

    $event.preventDefault();
    $event.stopPropagation();
}

/**
 * Process continuous scrolling.
 * @param {object} $scope - The directive scope.
 * @param {object} $event - The mouse move event.
 */
function doScroll($scope, $event) {
    if ($scope.scrolling) {
        var target = Math.max($scope.maxScroll, Math.min($scope.minScroll, $event.pageX - $scope.scrollOffset));

        console.log(target);

        $scope.view.css('left', target);
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

    $scope.scrolling = false;

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
 * Load custom control content.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $scope - The directive scope.
 */
function loadContent($q, $http, $scope) {
    $scope.contributions = {
        max: 6,
        pages: [
            {
                start: { month: 'aug', week: 1 },
                end: { month: 'aug', week: 2 }
            },

            {
                start: { month: 'aug', week: 3 },
                end: { month: 'aug', week: 3 }
            },

            {
                start: { month: 'aug', week: 4 },
                end: { month: 'aug', week: 4 }
            },

            {
                start: { month: 'sep', week: 1 },
                end: { month: 'sep', week: 3 }
            },

            {
                start: { month: 'sep', week: 4 },
                end: { month: 'oct', week: 1 }
            },

            {
                start: { month: 'oct', week: 2 },
                end: { month: 'oct', week: 4 }
            },

            {
                start: { month: 'nov', week: 1 },
                end: { month: 'nov', week: 4 }
            },

            {
                start: { month: 'dec', week: 1 },
                end: { month: 'dec', week: 4 }
            },

            {
                start: { month: 'jan', week: 1 },
                end: { month: 'jan', week: 2 }
            },

            {
                start: { month: 'jan', week: 3 },
                end: { month: 'jan', week: 4 }
            },

            {
                start: { month: 'feb', week: 1 },
                end: { month: 'feb', week: 2 }
            }
        ],
        months: {
            'aug': {
                tags: {
                    'engineering-robotics': 3,
                    'engineering-mechanical': 2,
                    'engineering-software': 1,
                    'design-industrial': 2,
                    'design-web': 4,
                    'art-painting': 2,
                    'design-cad': 1,
                    'art-crafts': 1
                },
                total: 16,
                weeks: {
                    'aug 1 - aug 7': {
                        tags: {
                            'engineering-robotics': 2,
                            'engineering-software': 1
                        },
                        total: 3
                    },
                    
                    'aug 8 - aug 14': {
                        tags: {
                            'design-industrial': 1,
                            'design-web': 2
                        },
                        total: 3
                    },
                    
                    'aug 15 - aug 21': {
                        tags: {
                            'art-painting': 2,
                            'design-cad': 1,
                            'design-industrial': 1,
                            'design-web': 1
                        },
                        total: 5
                    },
                    
                    'aug 22 - sep 4': {
                        tags: {
                            'art-crafts': 1,
                            'design-web': 1,
                            'engineering-mechanical': 2,
                            'engineering-robotics': 1
                        },
                        total: 5
                    }
                }
            },

            'sep': {
                tags: {
                    'engineering-software': 1,
                    'engineering-electrical': 4,
                    'design-industrial': 1,
                    'art-painting': 1,
                    'art-music': 2
                },
                total: 9,
                weeks: {
                    'sep 5 - sep 11': {
                        tags: {
                            'engineering-software': 1
                        },
                        total: 1
                    },

                    'sep 12 - sep 18': {
                        tags: {
                            'design-industrial': 1
                        },
                        total: 1
                    },

                    'sep 19 - sep 25': {
                        tags: {
                            'art-painting': 1,
                            'engineering-electrical': 3
                        },
                        total: 4
                    },

                    'sep 26 - oct 2': {
                        tags: {
                            'art-music': 2,
                            'engineering-electrical': 1
                        },
                        total: 3
                    }
                }
            },

            'oct': {
                tags: {
                    'design-web': 1,
                    'design-industrial': 1
                },
                total: 2,
                weeks: {
                    'oct 3 - oct 9': {
                        tags: {},
                        total: 0
                    },

                    'oct 10 - oct 16': {
                        tags: {
                            'design-web': 1
                        },
                        total: 1
                    },

                    'oct 17 - oct 23': {
                        tags: {},
                        total: 0
                    },

                    // Weird case! Weeks not aligning on month.
                    'oct 24 - oct 30': {
                        tags: {
                            'design-industrial': 1
                        },
                        total: 1
                    },
                }
            },

            'nov': {
                tags: {
                    'art-painting': 1,
                    'design-web': 1,
                    'design-frontend': 1,
                    'engineering-robotics': 3
                },
                total: 6,
                weeks: {
                    'oct 31 - nov 6': {
                        tags: {},
                        total: 0
                    },

                    'nov 7 - nov 13': {
                        tags: {
                            'art-painting': 1,
                            'design-web': 1
                        },
                        total: 2
                    },

                    'nov 14 - nov 20': {
                        tags: {
                            'design-frontend': 1,
                            'engineering-robotics': 3
                        },
                        total: 4
                    },

                    'nov 21 - nov 27': {
                        tags: {},
                        total: 0
                    }
                }
            },

            'dec': {
                tags: {
                    'engineering-mechanical': 2,
                    'art-painting': 1
                },
                total: 3,
                weeks: {
                    'nov 28 - dec 4': {
                        tags: {},
                        total: 0
                    },

                    'dec 5 - dec 11': {
                        tags: {
                            'engineering-mechanical': 2
                        },
                        total: 2
                    },

                    'dec 12 - dec 18': {
                        tags: {},
                        total: 0
                    },

                    'dec 19 - dec 25': {
                        tags: {
                            'art-painting': 1
                        },
                        total: 1
                    }
                }
            },

            'jan': {
                tags: {
                    'art-music': 1,
                    'design-web': 1,
                    'engineering-robotics': 2,
                    'engineering-software': 2
                },
                total: 6,
                weeks: {
                    'dec 26 - jan 1': {
                        tags: {},
                        total: 0
                    },

                    'jan 2 - jan 8': {
                        tags: {
                            'art-music': 1,
                            'design-web': 1,
                            'engineering-robotics': 2
                        },
                        total: 4
                    },

                    'jan 9 - jan 15': {
                        tags: {
                            'engineering-software': 2
                        },
                        total: 2
                    },

                    'jan 16 - 22': {
                        tags: {},
                        total: 0
                    }
                }
            },

            'feb': {
                tags: {
                    'design-web': 1,
                    'engineering-software': 1,
                    'engineering-mechanical': 2,
                    'engineering-robotics': 3
                },
                total: 7,
                weeks: {
                    'jan 23 - jan 29': {
                        tags: {
                            'engineering-software': 1
                        },
                        total: 1
                    },

                    'jan 30 - feb 5': {
                        tags: {
                            'design-web': 1,
                            'engineering-mechanical': 2,
                            'engineering-robotics': 3
                        },
                        total: 6
                    }
                }
            }
        }
    }

    $scope.isLoading = false;

    return $q.when();
}

/**
 * Get the captions for visible page buttons.
 * @param {object} $element - jQuery of the directive element.
 * @param {object} $scope - The directive scope.
 * @returns - The array of visible pages to render.
 */
function getVisiblePages($element, $scope) {
    // Calculate page element sizes.
    var buttonWidth = 37;
    var stripWidth = $element.width() - 40;

    // Reserved page button slots in 2-break view: 2 ellipsis and 2 arrows.
    var reservedPageCount = 4;

    // Calculate visible pages for 1- and 2-break views.
    var totalPages = $scope.contributions.pages.length;
    var totalVisiblePages = Math.round(stripWidth / buttonWidth);
    var maxVisiblePages = Math.min(totalPages, $scope.maxVisiblePages);
    var visiblePages = Math.min(maxVisiblePages, totalVisiblePages);
    var halfVisiblePages = Math.round(visiblePages / 2);
    var currentPage = parseInt($scope.currentPage);

    // Calculate visible pages for a 1-break view.
    var pagesBeforeBreak = halfVisiblePages;
    var pagesAfterBreak = maxVisiblePages - halfVisiblePages - 1;

    // Calculate visible pages for a 2-break view.
    var sectionPages = Math.max(1, visiblePages - reservedPageCount);
    var halfSectionPages = Math.round(sectionPages / 2);
    var firstPage = Math.floor((currentPage - sectionPages) / halfSectionPages) *
        halfSectionPages + pagesBeforeBreak - 1;
    
    // Allocate the visible page slots (including breaks).
    var pageNumbersArray = new Array(visiblePages);

    if (currentPage >= sectionPages &&
        currentPage - 1 <= totalPages - pagesAfterBreak) {
        // Calculate page slots for a 2-break view.
        // <- 1 ... X X X X ... n ->
        pageNumbersArray[0] = '1';
        pageNumbersArray[1] = '...';

        for (var n = 0; n < sectionPages; n++) {
            pageNumbersArray[n + 2] = (n + firstPage).toString();
        }

        pageNumbersArray[visiblePages - 2] = '... ';

        if (pageNumbersArray[visiblePages - 3] != totalPages.toString()) {
            pageNumbersArray[visiblePages - 1] = totalPages.toString();
        } else {
            // Remove an extra item after the break.
            pageNumbersArray = pageNumbersArray.slice(0, pageNumbersArray.length - 1);
        }
    } else {
        // Calculate page slots for a 1-break view.
        // <- 1 2 3 4 ... n-2 n-1 n ->
        var pagesBeforeBreak = halfVisiblePages;
        var pagesAfterBreak = maxVisiblePages - halfVisiblePages - 1;

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
    $scope.currentPage = page.toString();
    $scope.visiblePages = getVisiblePages(this, $scope);

    // Update the page indicator.
    var pageIndex = parseInt($scope.currentPage, 10) - 1;
    var page = $scope.contributions.pages[pageIndex];
    var months = Object.keys($scope.contributions.months);

    var startMonthIndex = months.indexOf(page.start.month);
    var startWeekIndex = page.start.week - 1;
    var endMonthIndex = months.indexOf(page.end.month);
    var endWeekIndex = page.end.week - 1;

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
        .css('left', selectionStart + 'px');
    this.find('.tag-page-bracket-right')
        .css('left', selectionEnd + 'px'); 
    this.find('.tag-page-underline-mask')
        .css('left', selectionStart - 21)
        .css('width', selectionEnd - selectionStart +
            50 + (endWeekIndex === 3 ? 6 : 0));
}

/**
 * Render tags.
 * @param {object} $scope - The directive scope.
 */
function renderTags($scope) {
    var monthSpacing = 6;
    var bracketWidth = 4;
    var $view = $scope.view;
    var $wrapper = null;
    
    for (var monthName in $scope.contributions.months) {
        var monthSummary = $scope.contributions.months[monthName];
        var $bar = null;

        $wrapper = $('<div class="tag-page"></div>')
            .css('left', $wrapper ?
                $wrapper.position().left + $wrapper.width() + monthSpacing : bracketWidth)
            .append($('<div class="tag-page-footer noselect"></div>')
                .text(monthName))
            .append($('<div class="tag-page-separator"></div>'))
            .appendTo($view);
        
        for (var weekDates in monthSummary.weeks) {
            var weekSummary = monthSummary.weeks[weekDates];
            var tagOffsetPercent = 0;
            var tagIndex = 0;

            $bar = $('<div class="tag-bar"></div>')
                .css('left', $bar ? $bar.position().left + $bar.width() : 0)
                .appendTo($wrapper);

            for (var tag in weekSummary.tags) {
                var tagCount = weekSummary.tags[tag];
                var tagPercent = Math.round(tagCount / $scope.contributions.max * 100);

                $('<div class="tag-block tag-' + tag + '"></div>')
                    .css('height', tagPercent.toString() + '%')
                    .css('bottom', 'calc(' + tagOffsetPercent + '% + ' + tagIndex + 'px)')
                    .appendTo($bar);

                tagOffsetPercent += tagPercent;
                tagIndex++;
            }
        }
    }

    $view.append($(
        '<svg class="tag-page-bracket-left" width="41" height="52" viewBox="0 0 41 52">' +
            '<use xlink:href="#left-bracket">' +
        '</svg>' +
        '<svg class="tag-page-bracket-right" width="41" height="52" viewBox="0 0 41 52">' +
            '<use xlink:href="#right-bracket">' +
        '</svg>' +
        '<div class="tag-page-underline-mask"></div>'));

    if ($wrapper) {
        $scope.minScroll = 10;
        $scope.maxScroll = $wrapper.position().left + $wrapper.width();

        $scope.view.css('left', -$scope.maxScroll + 'px');
        $scope.view.animate({
            left: $scope.minScroll
        }, Object.keys($scope.contributions.months).length * 150);
    }
}