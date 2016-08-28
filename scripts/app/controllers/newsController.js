/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file News controller.
|  @requires ../../angular/angular.js
|  @requires ../factories/newsFactory.js
|  @requires ../factories/commentsFactory.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";
        
    /**
     * Register news controller.
     */
    angular.module("zeroApp")
           .controller("newsController",
           ["$q", "news", "comments", "login", newsController]);

    /**
     * Implement news controller.
     * @param {object} $q - Promise factory.
     * @param {object} $news - News factory.
     * @param {object} $comments - Comments factory.
     * @param {object} $login - Login service.
     */
    function newsController($q, $news, $comments, $login)
    {
        /**
         * News factory.
         * @type {object}
         */
        this.newsFactory = $news;

        /** 
         * Comments factory.
         * @type {object}
         */
        this.commentsFactory = $comments;

        /**
         * Login service.
         * @type {object}
         */
        this.loginService = $login;

        /**
         * Service used to create promises.
         * @type {object}
         */
        this.promiseService = $q;

        /**
         * Loading state for each story key.
         * @type {object{}}
         */
        this.loading = {};

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
         * Showing login providers state for each story key.
         * @type {bool{}}
         */
        this.showLogin = {};

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
         * The user name to register.
         * @type {string}
         */
        this.registerName = null;

        /**
         * Load news story content.
         * @type {function}
         */
        this.loadStory = loadStory;

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
         * Authenticate with the application.
         * @type {function}
         */
        this.login = login;

        /**
         * Register with the application.
         * @type {function}
         */
        this.register = register;

        /**
         * Initialize the controller.
         */
        this.loginService.initialize().then(function(userInfo)
        {
            // Logged in with any supported external login provider.
            this.user = userInfo;

        }.bind(this));

        /**
         * Login user.
         * @param {string} provider - External login provider.
         */
        function login(provider)
        {
            this.loginService.login(provider).then(function(userInfo)
            {
                // If the user is logged in with provider but not registered, name property is null.
                this.user = userInfo;

            }.bind(this));
        }

        /**
         * Register user if needed.
         */
        function register()
        {
            return this.promiseService(function(resolve)
            {
                if (this.registerName && !this.user.name)
                {
                    this.loginService.register(
                        this.user.provider,
                        this.user.providerKey,
                        this.registerName).then(function()
                    {
                        resolve();
                    });
                }
                else
                {
                    resolve();
                }
            }.bind(this));
        }

        /**
         * Load news story content.
         * @param {int} storyId - The story Id.
         */
        function loadStory(storyId)
        {
            // Request markdown content for this story.
            this.newsFactory.get(
                {
                    id: storyId
                },

                function(result)
                {
                    // Story content finished loading.
                    this[storyId] = result.content;
                    this.loading[storyId] = false;

                }.bind(this),

                function(error)
                {
                    // Error loading story content.
                    this.loading[storyId] = false;
                    this.error[storyId] = error;

                }.bind(this)
            );

            this[storyId] = "";
            this.error[storyId] = null;
            this.loading[storyId] = true;
        }

        /**
         * Load news story comments.
         * @param {int} storyId - The story Id.
         */
        function loadComments(storyId)
        {
            this.commentsFactory.query(
                {
                    id: storyId
                },

                function(result)
                {
                    // Story comments finished loading.
                    this.comments[storyId] = result;
                    this.loadingComments[storyId] = false;

                }.bind(this),

                function(error)
                {
                    // Error loading story comments.
                    this.commentOperation[storyId] = "load comments";
                    this.commentError[storyId] = error;

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
        function addComment(storyId)
        {
            // Validate user name.
            if (!this.user.name && !this.registerName)
            {
                this.commentError[storyId] = "Please enter a name to use for posting this comment (we trust that you would want to).";
                return;
            }

            // Validate comment.
            if (!this.newComment[storyId] || !this.newComment[storyId].length)
            {
                this.commentError[storyId] = "Please enter a comment to post (you know about the Internet, right?)";
                return;
            }

            // Register user if not registered.
            this.register().then(function()
            {
                // Add comment.
                var commentContent = this.newComment[storyId];

                this.commentsFactory.create(
                    {
                        item: storyId,
                        author: this.user.name,
                        content: commentContent
                    },

                    function(result)
                    {
                        this.comments[storyId].push(
                        {
                            id: result.id,
                            author: this.user.name,
                            date: result.date,
                            content: commentContent
                        });

                    }.bind(this),

                    function(error)
                    {
                        this.commentOperation[storyId] = "post a comment";
                        this.commentError[storyId] = error;

                    }.bind(this)
                );

                this.commentError[storyId] = null;
                this.newComment[storyId] = null;

            }.bind(this));
        }
    }

})();