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
    $scope.scrollOffset = 0;
    $scope.scrollInit = 0;
    $scope.minScroll = 0;
    $scope.maxScroll = 0;
    $scope.bracketWidth = 4;
    $scope.buttonWidth = 0;
    $scope.view = null;
    $scope.pages = null;
    $scope.contributions = {};
    $scope.visiblePages = [];
    $scope.maxVisibleSlots = 11;
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
    $scope.scrollTagView = scrollTagView.bind($element, $scope);
    $scope.resize = resize.bind($element, $scope, $safeApply);

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
                '<symbol id="page-button-focus-outline">' +
                    '<polygon points="2.5,28.5 1.8,26.8 8.5,20.1 8.5,1.5 9.5,0.5 36.5,0.5 37.5,1.5 37.5,20.9 29.9,28.5 	"/>' +
                '</symbol>' +
                '<symbol id="left-scroll-button-focus-outline">' +
                    '<polyline points="0.5,28 0.5,8.1 8.1,0.5 31,0.5 31.5,1 31.5,20.9 23.9,28.5 1,28.5"/>' +
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
                    '<polygon points="10,4 10,0 4,0 0,0 0,41 4,41 10,41 10,37 4,37 4,4"/>' +
                '</symbol>' +
                '<symbol id="right-bracket">' +
                    '<polygon points="0,4 0,0 6,0 10,0 10,41 6,41 0,41 0,37 6,37 6,4"/>' +
                '</symbol>' +
            '</svg>' +

            // Previous page button.
            '<a role="button" tabindex="0" class="date-selector-scroll date-selector-scroll-left noselect" data-ng-click="prevPage()">' +
                '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-outline"></use>' +
                '</svg>' +
                '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                    '<use xlink:href="#left-scroll-button-outline"></use>' +
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
                '<a role="button" ng-attr-tabindex="{{isSeparator(page) ? -1 : 0}}" class="date-selector-page noselect" ' +
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
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<div class="date-selector-page-label">' +
                        '<span class="date-selector-page-fallback">page</span>' +
                        '<div class="date-selector-page-number">{{page}}</div>' +
                    '</div>' +
                '</a>' +

                // Next page button.
                // (has to be inside pages container to follow last page button).
                '<a role="button" tabindex="0" class="date-selector-scroll date-selector-scroll-right noselect" data-ng-click="nextPage()">' +
                    '<svg class="date-selector-page-hover" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
                    '</svg>' +
                    '<svg class="date-selector-page-pushed" width="35" height="27" viewBox="0 0 35 27">' +
                        '<use xlink:href="#page-button-outline"></use>' +
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

        // Initialize the tag view.
        $scope.view = $element.find('.date-selector-view');
        $scope.pages = $element.find('.date-selector-pages');

        if ($scope.contributions.max) {
            $scope.buttonWidth = $scope.pages.find('.date-selector-page').first().width();
            
            $scope.renderTags();
            $scope.selectPage('1');

            $($window).on('resize', $scope.resize);
        }
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
                start: { month: 'feb', week: 1 },
                end: { month: 'feb', week: 2 }
            },

            {
                start: { month: 'jan', week: 2 },
                end: { month: 'jan', week: 3 }
            },

            {
                start: { month: 'dec', week: 1 },
                end: { month: 'dec', week: 4 }
            },

            {
                start: { month: 'nov', week: 2 },
                end: { month: 'nov', week: 3 }
            },

            {
                start: { month: 'oct', week: 1 },
                end: { month: 'oct', week: 4 }
            },

            {
                start: { month: 'sep', week: 1 },
                end: { month: 'sep', week: 2 }
            },

            {
                start: { month: 'sep', week: 3 },
                end: { month: 'sep', week: 4 }
            },

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
            }
        ],
        months: {
            'feb': {
                tags: {
                    'design-web': 1,
                    'engineering-software': 1,
                    'engineering-mechanical': 2,
                    'engineering-robotics': 3
                },
                total: 7,
                weeks: {
                    'jan 30 - feb 5': {
                        tags: {
                            'design-web': 1,
                            'engineering-mechanical': 2,
                            'engineering-robotics': 3
                        },
                        total: 6
                    },

                    'jan 23 - jan 29': {
                        tags: {
                            'engineering-software': 1
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
                    'jan 16 - 22': {
                        tags: {},
                        total: 0
                    },

                    'jan 9 - jan 15': {
                        tags: {
                            'engineering-software': 2
                        },
                        total: 2
                    },

                    'jan 2 - jan 8': {
                        tags: {
                            'art-music': 1,
                            'design-web': 1,
                            'engineering-robotics': 2
                        },
                        total: 4
                    },

                    'dec 26 - jan 1': {
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
                    'dec 19 - dec 25': {
                        tags: {
                            'art-painting': 1
                        },
                        total: 1
                    },

                    'dec 12 - dec 18': {
                        tags: {},
                        total: 0
                    },

                    'dec 5 - dec 11': {
                        tags: {
                            'engineering-mechanical': 2
                        },
                        total: 2
                    },

                    'nov 28 - dec 4': {
                        tags: {},
                        total: 0
                    }
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
                    'nov 21 - nov 27': {
                        tags: {},
                        total: 0
                    },

                    'nov 14 - nov 20': {
                        tags: {
                            'design-frontend': 1,
                            'engineering-robotics': 3
                        },
                        total: 4
                    },

                    'nov 7 - nov 13': {
                        tags: {
                            'art-painting': 1,
                            'design-web': 1
                        },
                        total: 2
                    },

                    'oct 31 - nov 6': {
                        tags: {},
                        total: 0
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
                    // Weird case! Weeks not aligning on month.
                    'oct 24 - oct 30': {
                        tags: {
                            'design-industrial': 1
                        },
                        total: 1
                    },

                    'oct 17 - oct 23': {
                        tags: {},
                        total: 0
                    },

                    'oct 10 - oct 16': {
                        tags: {
                            'design-web': 1
                        },
                        total: 1
                    },

                    'oct 3 - oct 9': {
                        tags: {},
                        total: 0
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
                    'sep 26 - oct 2': {
                        tags: {
                            'art-music': 2,
                            'engineering-electrical': 1
                        },
                        total: 3
                    },

                    'sep 19 - sep 25': {
                        tags: {
                            'art-painting': 1,
                            'engineering-electrical': 3
                        },
                        total: 4
                    },

                    'sep 12 - sep 18': {
                        tags: {
                            'design-industrial': 1
                        },
                        total: 1
                    },

                    'sep 5 - sep 11': {
                        tags: {
                            'engineering-software': 1
                        },
                        total: 1
                    }
                }
            },

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
                    'aug 22 - sep 4': {
                        tags: {
                            'art-crafts': 1,
                            'design-web': 1,
                            'engineering-mechanical': 2,
                            'engineering-robotics': 1
                        },
                        total: 5
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
                    
                    'aug 8 - aug 14': {
                        tags: {
                            'design-industrial': 1,
                            'design-web': 2
                        },
                        total: 3
                    },
                    
                    'aug 1 - aug 7': {
                        tags: {
                            'engineering-robotics': 2,
                            'engineering-software': 1
                        },
                        total: 3
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
    var buttonWidth = 34;
    var stripWidth = $element.width();

    // Reserved slots for 1 break view - ... and ->
    var reservedSlots1Break = 2;

    // Reserved slots for 2 break view - 2x ... and ->
    var reservedSlots2Break = 4;

    // Calculate visible pages for 1- and 2-break views.
    var currentPage = parseInt($scope.currentPage);
    var totalPages = $scope.contributions.pages.length;
    var totalVisibleSlots = Math.round(stripWidth / buttonWidth);

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
    var middleBreakGroupCount = pagesMiddleBreak - 2;

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
    $scope.currentPage = page.toString();
    $scope.visiblePages = getVisiblePages($scope.pages, $scope);

    // Update the selection brackets.
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
 */
function renderTags($scope) {
    var monthMargin = null;
    var barHeight = null;
    var minBlockHeight = null;
    var $view = $scope.view;
    var $wrapper = null;
    
    // Render month wrappers.
    for (var monthName in $scope.contributions.months) {
        var monthSummary = $scope.contributions.months[monthName];
        var $bar = null;

        $wrapper = $('<div class="tag-page"></div>')
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

            $bar = $('<div class="tag-bar"></div>')
                .css('left', $bar ? $bar.position().left + $bar.width() : 0)
                .appendTo($wrapper);

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
        }
    }

    // Render selection brackets and the underline mask.
    $view.append($(
        '<svg class="tag-page-bracket-left" width="41" height="52" viewBox="0 0 41 49">' +
            '<use xlink:href="#left-bracket">' +
        '</svg>' +
        '<svg class="tag-page-bracket-right" width="41" height="52" viewBox="0 0 41 49">' +
            '<use xlink:href="#right-bracket">' +
        '</svg>' +
        '<div class="tag-page-underline-mask"></div>'));

    if ($wrapper) {
        // Calculate range for interactive scrolling.
        $scope.minScroll = parseInt($scope.view.css('left'));
        $scope.maxScroll = Math.max(
            $scope.minScroll,
            $wrapper.position().left + $wrapper.width() - $view.width() + $scope.bracketWidth);

        // Start with tag view off-screen for a slide-in animation.
        $scope.view.css('left', -$view.width() + 'px');
    }
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
        $scope.selectPage($scope.currentPage);
    });
}