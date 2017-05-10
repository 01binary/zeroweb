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
     * The authenticated app user, if any.
     * @type {object}
     */
    this.user = null;

    /**
     * Comments for each article id.
     * @type {Object}
     */
    this.comments = {};

    /**
     * Whether currently loading comments.
     * @type {bool}
     */
    this.loadingComments = false;

    /**
     * Whether currently adding a comment for each article id.
     * @type {bool[]}
     */
    this.addingComment = {};

    /**
     * New comment text for each article id.
     * @type {string[]}
     */
    this.newComment = {};

    /**
     * Comment submission error for each article id.
     * @type {object[]}
     */
    this.commentError = {};

    /**
     * Comment error operation for each article id.
     * @type {string[]}
     */
    this.commentOperation = {};

    /**
     * Load article comments.
     * @type {function}
     */
    this.loadComments = loadComments;

    /**
     * Add article comment.
     * @type {function}
     */
    this.addComment = addComment;

    /**
     * Add article star (favorite).
     * @type {function}
     */
    this.addStar = addStar;

    /**
     * Add article views.
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
        // Get logged on user if any.
        this.loginService.getUser().then(function(result) {
            this.user = result.name || null;
        }.bind(this));

        // Get loaded articles.
        var articles = [];
        $('article').each(function(index, element) {
            articles.push(parseInt($(element).attr('data-id'), 10));
        });

        // Scroll to article if specified.
        $timeout(this.scrollToAnchor.bind(this), 100);

        // Get article comments.
        this.loadComments(articles);

        // Report article views.
        this.addView(articles);
    }

    /**
     * Scroll to anchor after loading.
     */
    function scrollToAnchor() {
        if ($routeParams.story) {
            if (this.loadingComments) {
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
     * Load article comments.
     * @param {int[]} articles - The article identifiers.
     */
    function loadComments(articles) {
        this.loadComments = true;

        this.commentsStore.query(
            {
                id: articles
            },

            function(result) {
                // Article comments finished loading.
                this.loadingComments = false;

                for (var n = 0; n < articles.length; n++) {
                    var articleId = articles[n];
                    this.comments[articleId] = result.filter(function(comment) {
                        return comment.articleId === articleId;
                    });
                }
            }.bind(this),

            function(error) {
                // Error loading article comments.
                this.loadingComments = false;

                for (var articicleId in articles) {
                    this.commentOperation[articicleId] = 'load comments';
                    this.commentError[articicleId] = error;
                }
            }.bind(this)
        );

        for (var articleId in articles) {
            this.comments[articleId] = [];
            this.addingComment[articleId] = false;
            this.newComment[articleId] = null;
            this.commentError[articleId] = null;
        }
    }

    /**
     * Add article comment.
     * @param {int} articleId - The id of the article to comment on.
     */
    function addComment(articleId) {
        // Validate user name.
        if (!this.user) {
            this.commentError[articleId] = 'Please login with one of the providers above to post comments.';
            return;
        }

        // Validate comment.
        if (!this.newComment[articleId] || !this.newComment[articleId].length) {
            this.commentError[articleId] = 'Please enter a comment to post.';
            return;
        }

        // Add comment.
        var commentContent = this.newComment[articleId];

        this.commentsStore.create(
            {
                articleId: articleId,
                content: commentContent
            },

            function(result) {
                this.comments[articleId].push({
                    articleId: articleId,
                    id: result.id,
                    author: this.user,
                    date: result.date,
                    formattedDate: result.formattedDate,
                    content: commentContent,
                    votesReadOnly: true
                });

            }.bind(this),

            function(error) {
                this.commentOperation[articleId] = 'post a comment';
                this.commentError[articleId] = error;

            }.bind(this)
        );

        this.commentError[articleId] = null;
        this.newComment[articleId] = null;
    }

    /**
     * Add article views.
     * @param {int[]} articles - The article identifiers.
     */
    function addView(articles) {
        this.newsStore.view(
            {
                id: articles
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