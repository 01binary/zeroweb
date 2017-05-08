/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file News controller.
|  @requires ../../angular/angular.js
|  @requires ../factories/newsStore.js
|  @requires ../factories/commentsStore.js
|  @requires ../factories/safeApplyFactory.js
|  @requires ../factories/inputResizeFactory.js
|  @requires ../services/loginService.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/**
 * Register news controller.
 */
angular.module('zeroApp').controller('newsController', [
    'news',
    'comments',
    'safeApply',
    'inputResize',
    'login',
    '$scope',
    '$routeParams',
    '$location',
    '$timeout',
    newsController
]);

/**
 * Implement news controller.
 * @param {object} $news - News factory.
 * @param {object} $comments - Comments factory.
 * @param {object} $safeApply - Safe apply factory.
 * @param {object} $inputResize - Input auto resize factory.
 * @param {object} $login - Login service.     
 * @param {object} $scope - Controller scope.
 * @param {object} $routeParams - The route parameters.
 * @param {object} $location - The navigator location.
 * @param {object} $timeout - The timeout service.
 */
function newsController($news, $comments, $safeApply, $inputResize, $login, $scope, $routeParams, $location, $timeout) {
    /**
     * News store.
     * @type {object}
     */
    this.newsStore = $news;

    /** 
     * Comments store.
     * @type {object}
     */
    this.commentsStore = $comments;

    /**
     * Input resize factory.
     * @type {function}
     */
    this.inputResizeFactory = $inputResize;

    /**
     * Login service.
     * @type {object}
     */
    this.loginService = $login;

    /**
     * Error state for each story key.
     * @type {object{}}
     */
    this.error = {};

    /**
     * Comments for each story key.
     * @type {object{}}
     */
    this.comments = {};

    /**
     * Loading comments state for each story key.
     * @type {bool{}}
     */
    this.loadingComments = {};

    /**
     * Adding comment state for each story key.
     * @type {bool{}}
     */
    this.addingComment = {};

    /**
     * New comment text for each story key.
     * @type {string{}}
     */
    this.newComment = {};

    /**
     * Comment submission or loading error for each story key.
     * @type {object{}}
     */
    this.commentError = {};

    /**
     * Comment error operation for each story key.
     */
    this.commentOperation = {};

    /**
     * The authenticated app user, if any.
     * @type {object}
     */
    this.user = null;

    /**
     * Load news story comments.
     * @type {function}
     */
    this.loadComments = loadComments;

    /**
     * Add a story comment.
     * @type {function}
     */
    this.addComment = addComment;

    /**
     * Add a story star (favorite).
     * @type {function}
     */
    this.addStar = addStar;

    /**
     * Add a story view.
     */
    this.addView = addView;

    /**
     * Upvote a comment.
     * @type {function}
     */
    this.upVote = upVote;

    /**
     * Downvote a comment.
     * @type {function}
     */
    this.downVote = downVote;

    /**
     * Authenticate user.
     * @type {function}
     */
    this.login = login;

    /**
     * How many articles were loaded.
     * @type {number}
     */
    this.count = 0;

    /**
     * How many articles have comments loaded.
     * @type {number}
     */
    this.commentsLoaded = 0;

    /**
     * Initialize controller.
     * @type {function}
     */
    this.initialize = initialize;

    /**
     * Scroll to anchor after loading.
     * @type {function}
     */
    this.scrollToAnchor = scrollToAnchor;

    /**
     * Initialize controller.
     */
    function initialize() {
        this.loginService.getUser().then(function(result) {
            this.user = result.name || null;
        }.bind(this));

        var $articles = $('article');

        $articles.each(function(index, article) {
            this.addView($(article).attr('data-id'));
        }.bind(this));

        this.count = $articles.length;

        $timeout(this.scrollToAnchor.bind(this), 100);
    }

    /**
     * Scroll to anchor after loading.
     */
    function scrollToAnchor() {
        if ($routeParams.story) {
            if (this.commentsLoaded !== this.count) {
                $timeout(this.scrollToAnchor.bind(this), 100);
                return;
            }

            // Find article heading by Id.
            var $anchor = $('#story' + $routeParams.story);

            if ($anchor.length == 0) {
                // Find article heading by Key.
                $anchor = $('a[href*="' + $routeParams.story + '"]');
            }

            var $article = $anchor.closest('article');

            if ($article.length === 0 || $anchor.length === 0) {
                return;
            }

            // Find the sub-heading if specified.
            if ($location.hash()) {
                $anchor = $article.find('a[name="' + $location.hash() + '"]');

                if ($anchor.length === 0) {
                    return;
                }
            }

            var anchorRect = $anchor[0].getBoundingClientRect();
            var articleRect = $article[0].getBoundingClientRect();
            var viewHeight = window.innerHeight || document.documentElement.clientHeight;

            if (anchorRect.bottom >= 0 &&
                anchorRect.bottom <= viewHeight &&
                articleRect.bottom >= 0) {
                return;
            }

            $('html, body').animate({
                scrollTop: $anchor.offset().top
            }, 'slow');
        }
    }

    /**
     * Authenticate user.
     */
    function login() {
        this.loginService.showPopup('login', function(result) {
            if (result && result.success) {
                $safeApply($scope, function() {
                    this.user = result.parameter;
                    
                }.bind(this));
            }
        }.bind(this));
    }

    /**
     * Load news story comments.
     * @param {int} storyId - The story Id.
     */
    function loadComments(storyId) {
        this.commentsStore.query(
            {
                id: storyId
            },

            function(result) {
                // Story comments finished loading.
                this.comments[storyId] = result;
                this.loadingComments[storyId] = false;
                this.commentsLoaded++;

            }.bind(this),

            function(error) {
                // Error loading story comments.
                this.commentOperation[storyId] = 'load comments';
                this.commentError[storyId] = error;
                this.commentsLoaded++;

            }.bind(this)
        );

        this.comments[storyId] = [];
        this.loadingComments[storyId] = true;
        this.addingComment[storyId] = false;
        this.newComment[storyId] = null;
        this.commentError[storyId] = null;
    }

    /**
     * Add a story comment.
     * @param {int} storyId - The id of the story to comment on.
     */
    function addComment(storyId) {
        // Validate user name.
        if (!this.user) {
            this.commentError[storyId] = 'Please login with one of the providers above to post comments.';
            return;
        }

        // Validate comment.
        if (!this.newComment[storyId] || !this.newComment[storyId].length) {
            this.commentError[storyId] = 'Please enter a comment to post.';
            return;
        }

        // Add comment.
        var commentContent = this.newComment[storyId];

        this.commentsStore.create(
            {
                articleId: storyId,
                content: commentContent
            },

            function(result) {
                this.comments[storyId].push({
                    id: result.id,
                    author: this.user,
                    date: result.date,
                    formattedDate: result.formattedDate,
                    content: commentContent,
                    votesReadOnly: true
                });

            }.bind(this),

            function(error) {
                this.commentOperation[storyId] = 'post a comment';
                this.commentError[storyId] = error;

            }.bind(this)
        );

        this.commentError[storyId] = null;
        this.newComment[storyId] = null;
    }

    /**
     * Add a story view.
     * @param {int} storyId - The id of the story to increment views on.
     */
    function addView(storyId) {
        this.newsStore.view(
            {
                id: storyId
            }
        );
    }

    /**
     * Add a story star.
     * @param {int} storyId - The id of the story to star.
     */
    function addStar(storyId) {
        var $star = $('#star-' + storyId);

        if ($star.find('metadata-icon-readonly').length > 0)
            return;

        this.newsStore.star(
            {
                id: storyId
            },

            function(result) {
                $star.find('.metadata-icon')
                    .addClass('metadata-icon-readonly')
                    .addClass('metadata-icon-toggled');

                $star.find('.metadata-indicator-content').text(result.stars);

            }.bind(this),

            function(error) {
                this.commentOperation[storyId] = 'add a star';
                this.commentError[storyId] = error.statusText;

            }.bind(this)
        );
    }

    /**
     * Upvote a comment.
     * @param {int} storyId - The id of the story the comment is for.
     * @param {int} commentId - The id of the comment to upvote.
     */
    function upVote(storyId, commentId) {
        this.commentsStore.upVote(
            {
                id: commentId,
            },

            function(result) {
                var storyComments = this.comments[storyId];

                for (var index in storyComments)
                {
                    if (storyComments[index].id == commentId)
                    {
                        storyComments[index].votes = result.votes;
                        storyComments[index].votesReadOnly = true;
                        break;
                    }
                }

            }.bind(this),

            function(error) {
                this.commentOperation[storyId] = 'upvote a comment';
                this.commentError[storyId] = error.statusText;

            }.bind(this)
        );
    }

    /**
     * Downvote a comment.
     * @param {int} storyId - The id of the story the comment is for.
     * @param {int} commentId - The id of the comment to downvote.
     */
    function downVote(storyId, commentId) {
        this.commentsStore.downVote(
            {
                id: commentId,
            },

            function(result) {
                var storyComments = this.comments[storyId];

                for (var index in storyComments) {
                    if (storyComments[index].id == commentId) {
                        storyComments[index].votes = result.votes;
                        storyComments[index].votesReadOnly = true;
                        break;
                    }
                }

            }.bind(this),

            function(error) {
                this.commentOperation[storyId] = 'downvote a comment';
                this.commentError[storyId] = error.statusText;

            }.bind(this)
        );
    }
}