/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Service that displays external login popup.
|  @requires ../../angular/angular.js
|  @requires ../factories/usersFactory.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";

    /**
     * Register login service.
     */
    angular.module("zeroApp")
           .service("login", ["$q", "users", loginService]);

    /**
     * Implement login service.
     * @param {object} $q - Promise service.
     * @param {object} $users - Users factory.
     */
    function loginService($q, $users)
    {
        /**
         * Promise service.
         * @type {object}
         */
        this.promiseService = $q;

        /** 
         * Users factory.
         * @type {object}
         */
        this.usersFactory = $users;

        /**
         * @type {function} Stores the close handler for notifying about the popup result.
         */
        this.closeHandler = null;

        /**
         * @type {int} Timer used to watch the popup.
         */
        this.watchTimer = null;

        /**
         * @type {function} Gets the authenticated user name.
         */
        this.getUser = getUser;

        /**
         * @type {function} Displays a login popup.
         */
        this.showPopup = showPopup;

        /**
         * @type {function} Watches a login popup for closure or dismissal.
         */
        this.watchPopup = watchPopup;

        /**
         * @type {function} Handles popup closure where no result is available.
         */
        this.cancelPopup = cancelPopup;

        /**
         * @type {function} Handles popup dismissal to handle the result.
         */
        this.closePopup = closePopup;

        /**
         * Gets the authenticated user name.
         * @returns {string} Application user name or null if client is not authenticated.
         */
        function getUser()
        {
            return this.promiseService(function(resolve)
            {
                this.usersFactory.get(function(result)
                {
                    resolve(result);
                });

            }.bind(this));
        }

        /**
         * Displays a login popup.
         * @param {string} name - Login form target name.
         * @param {function} onClose - Receives the login result.
         */
        function showPopup(name, onClose)
        {
            var popup = window.open(
                "about:blank",
                name,
                "width=455,height=485,location=0,centerscreen=1,resizable=0,scrollbars=0,status=0,toolbar=0,menubar=0,personalbar=0,popup=1",
                true);

            this.watchPopup(popup, onClose);
        }

        /**
         * Watches and closes a popup when it returns a result.
         * @param {window} popup - Popup window.
         * @param {function} onClose - Receives the login result.
         */
        function watchPopup(popup, onClose)
        {
            if (popup)
            {
                if (this.watchTimer)
                {
                    try
                    {
                        if (popup.closed)
                        {
                            this.cancelPopup(popup, this.closeHandler);
                        }
                        else if (popup.result)
                        {
                            this.closePopup(popup, this.closeHandler);
                        }
                    }
                    catch (e) {}
                }
                else
                {
                    // Start watching.
                    this.closeHandler = onClose;
                    this.watchTimer = setInterval(this.watchPopup.bind(this), 200, popup);
                }
            }
            else if (this.watchTimer)
            {
                // Stop watching.
                clearInterval(this.watchTimer);
                this.watchTimer = null;
            }
        }

        /**
         * Handles popup closure where no result is available.
         * @param {object} popup - Popup that was closed.
         * @param {function} onClose - Receives popup result.
         */
        function cancelPopup(popup, onClose)
        {
            this.watchPopup(null);
            onClose({ success: false });
        }

        /**
         * Handles popup dismissal to handle the result.
         * @param {object} popup - Popup that was closed.
         * @param {function} onClose - Receives popup result.
         */
        function closePopup(popup, onClose)
        {
            this.watchPopup(null);
            onClose(popup.result);
            popup.close();
        }
    }
})();