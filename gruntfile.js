/// <binding AfterBuild='uglify' />
module.exports = function(grunt)
{
    // Includes
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Tasks
    grunt.initConfig(
    {
        // Minify the application into one script file.
        uglify:
        {
            options:
            {
                compress:
                {
                    drop_debugger: false
                }
            },
            
            my_target:
            {
                files:
                {
                    "zero.min.js":
                    [
                        // jQuery
                        "scripts/jquery/dist/jquery.js",
                        
                        // Angular
                        "scripts/angular/angular.js",
                        "scripts/angular-route/angular-route.js",
                        
                        // Application
                        "scripts/app.js",
                        "scripts/app/**/*.js"
                    ]
                }
            }
        },

        // Trigger minification when scripts change.
        watch:
        {
            scripts:
            {
                files: [ "scripts/**/*.js" ],
                tasks: [ "uglify" ]
            }
        }
    });

    // Startup
    grunt.registerTask("default", [ "uglify", "watch" ]);
};