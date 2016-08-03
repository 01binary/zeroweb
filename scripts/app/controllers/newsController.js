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
         * Load news story content.
         * @type {function}
         */
        this.loadStory = loadStory;

        /**
         * Load news story content.
         * @param {int} storyId - The story Id.
         */
        function loadStory(storyId)
        {
            if (!this.loading)
            {
                // Keep track of loading state for each story Id.
                this.loading = {};
            }

            this.newsFactory.get(
                {
                    // Request markdown content for this story.
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

                    if (error.statusText)
                    {
                        this[storyId] = "[" + error.status + "] " +
                            error.statusText;
                    }
                    else
                    {
                        this[storyId] = error;
                    }
                    
                }.bind(this)
            );

            this[storyId] = "";
            this.loading[storyId] = true;
        }
    }

})();