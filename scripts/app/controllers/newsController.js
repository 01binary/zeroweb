/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file News controller.
|  @requires ../../angular/angular.js
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
           .controller("newsController", ["news", newsController]);

    /**
     * Implement news controller.
     * @param {object} $news - News factory.
     */
    function newsController($news)
    {
        /**
         * News factory.
         * @type {object}
         */
        this.newsFactory = $news;

        /**
         * News stories.
         * @type {object[]}
         */
        this.stories = [];

        /**
         * Whether loading stories.
         * @type {bool}
         */
        this.loadingStories = false;

        /**
         * Error message if failed to load.
         */
        this.loadingStoriesError = "";

        /**
         * Load stories.
         * @type {function}
         */
        this.loadStories = loadStories;

        /**
         * Initialize controller.
         */
        this.loadStories();

        /**
         * Load stories.
         */
        function loadStories()
        {
            this.loadingStories = true;

            this.newsFactory.query(
                {},

                function(result)
                {
                    this.stories = result;
                    this.loadingStories = false;

                }.bind(this),

                function(error)
                {
                    this.loadingStoriesError = error;
                    this.loadingStories = false;
                    
                }.bind(this)
            );
        }
    }

})();