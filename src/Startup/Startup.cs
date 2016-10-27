/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Application startup.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.IO;
using AspNet.Security.OAuth.GitHub;
using AspNet.Security.OAuth.LinkedIn;
using AspNet.Security.OAuth.Reddit;
using AspNet.Security.OAuth.Yahoo;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using ZeroWeb.Models;

namespace ZeroWeb
{
    /// <summary>
    /// Application startup.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initialize configuration.
        /// </summary>
        /// <param name="env">The hosting environment.
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("./Settings/appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"./Settings/appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                builder.AddUserSecrets();
            }

            Configuration = builder.Build();
        }

        /// <summary>
        /// Gets the application configuration.
        /// </summary>
        public IConfigurationRoot Configuration { get; }

        /// <summary>
        /// Configures the injection container.
        /// </summary>
        /// <param name="services">The IoC container interface.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddSession();

            services.AddOptions();
            services.AddSingleton<IConfiguration>(this.Configuration);

            services.AddEntityFrameworkSqlite()
                    .AddDbContext<Context>();
            
            services.AddIdentity<User, IdentityRole>(options =>
                    {
                        options.User.AllowedUserNameCharacters += "=";
                    })
                    .AddEntityFrameworkStores<Context>()
                    .AddDefaultTokenProviders();

            services.AddScoped(typeof(IDataStore), typeof(SiteDataStore));
        }
        
        /// <summary>
        /// Configures the injected dependencies.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        /// <param name="env">The hosting environment.</param>
        /// <param name="loggerFactory">The logger factory.</param>
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            // Redirect all routes to single page application views.
            this.ConfigureSinglePageRoutes(app);

            if (env.IsDevelopment())
            {
                // Enable logging.
                loggerFactory.AddConsole(Configuration.GetSection("Logging"));
                loggerFactory.AddDebug();

                // Setup static resource routes for development.
                app.UseStaticFiles(new StaticFileOptions()
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(Directory.GetCurrentDirectory(), "Styles")),
                    RequestPath = "/Styles"
                });

                app.UseStaticFiles(new StaticFileOptions()
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(Directory.GetCurrentDirectory(), "Scripts")),
                    RequestPath = "/Scripts"
                });

                // Redirect routes that throw exceptions to developer error page.
                app.UseDeveloperExceptionPage();

                // Enable browser debugging connection.
                app.UseBrowserLink();
            }
            else
            {
                // Redirect routes that throws exceptions to production error page.
                app.UseExceptionHandler("/Shared/Error");
            }
            
            // Setup static resource routes.
            app.UseStaticFiles();

            // Setup identity.
            app.UseIdentity();

            // Setup sessions.
            app.UseSession();

            // Setup Yahoo authentication.
            this.ConfigureYahooAuthentication(app);

            // Setup LinkedIn authentication.
            this.ConfigureLinkedInAuthentication(app);

            // Setup Reddit authentication.
            this.ConfigureRedditAuthentication(app);

            // Setup Microsoft authentication.
            this.ConfigureMicrosoftAuthentication(app);

            // Setup Github authentication.
            this.ConfigureGithubAuthentication(app);

            // Setup Google authentication.
            this.ConfigureGoogleAuthentication(app);

            // Setup Twitter authentication.
            this.ConfigureTwitterAuthentication(app);

            // Setup Facebook authentication.
            this.ConfigureFacebookAuthentication(app);

            // Setup layout and partial routes.
            this.ConfigureRoutes(app);
        }

        /// <summary>
        /// Configures the application routing.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureRoutes(IApplicationBuilder app)
        {
            app.UseMvc(routes =>
            {
                // Default route redirects to Startup controller.
                routes.MapRoute(
                    name: string.Empty,
                    template: string.Empty,
                    defaults: new
                    {
                        controller = "Startup",
                        action = "Index"
                    }
                );

                // News.
                routes.MapRoute(
                    name: "news",
                    template: "views/news",
                    defaults: new
                    {
                        controller = "News",
                        action = "Index"
                    }
                );

                // Articles.
                routes.MapRoute(
                    name: "articles",
                    template: "views/articles",
                    defaults: new
                    {
                        controller = "Articles",
                        action = "Index"
                    }
                );

                // Projects.
                routes.MapRoute(
                    name: "projects",
                    template: "views/projects",
                    defaults: new
                    {
                        controller = "Projects",
                        action = "Index"
                    }
                );

                // About.
                routes.MapRoute(
                    name: "about",
                    template: "views/about",
                    defaults: new
                    {
                        controller = "About",
                        action = "Index"
                    }
                );
            });
        }

        /// <summary>
        /// Configures single page application routing.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureSinglePageRoutes(IApplicationBuilder app)
        {
            app.Use(async(context, next) =>
            {
                await next();

                if (context.Response.StatusCode == 404 &&
                    !Path.HasExtension(context.Request.Path.Value))
                {
                    context.Request.Path = "/";
                    await next();
                }
            });
        }

        /// <summary>
        /// Configures the Yahoo external login provider.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureYahooAuthentication(IApplicationBuilder app)
        {
            var yahooOptions = new YahooAuthenticationOptions()
            {
                ClientId = this.Configuration["yahooId"],
                ClientSecret = this.Configuration["yahooSecret"]
            };

            // Ensure secrets have been loaded.
            if (string.IsNullOrEmpty(yahooOptions.ClientId) ||
                string.IsNullOrEmpty(yahooOptions.ClientSecret))
            {
                throw new InvalidOperationException("Ensure yahooId and yahooSecret have been set with \"dotnet user-secrets set <key> <value>\"");
            }

            app.UseYahooAuthentication(yahooOptions);
        }

        /// <summary>
        /// Configures the Reddit external login provider.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureRedditAuthentication(IApplicationBuilder app)
        {
            var redditOptions = new RedditAuthenticationOptions()
            {
                ClientId = this.Configuration["redditId"],
                ClientSecret = this.Configuration["redditSecret"]
            };

            // Ensure secrets have been loaded.
            if (string.IsNullOrEmpty(redditOptions.ClientId) ||
                string.IsNullOrEmpty(redditOptions.ClientSecret))
            {
                throw new InvalidOperationException("Ensure redditId and redditSecret have been set with \"dotnet user-secrets set <key> <value>\"");
            }

            app.UseRedditAuthentication(redditOptions);
        }

        /// <summary>
        /// Configures the LinkedIn external login provider.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureLinkedInAuthentication(IApplicationBuilder app)
        {
            var linkedInOptions = new LinkedInAuthenticationOptions()
            {
                ClientId = this.Configuration["linkedInId"],
                ClientSecret = this.Configuration["linkedInSecret"]
            };

            // Ensure secrets have been loaded.
            if (string.IsNullOrEmpty(linkedInOptions.ClientId) ||
                string.IsNullOrEmpty(linkedInOptions.ClientSecret))
            {
                throw new InvalidOperationException("Ensure linkedInId and linkedInSecret have been set with \"dotnet user-secrets set <key> <value>\"");
            }

            app.UseLinkedInAuthentication(linkedInOptions);
        }

        /// <summary>
        /// Configures the Google external login provider.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureGoogleAuthentication(IApplicationBuilder app)
        {
            var googleOptions = new GoogleOptions()
            {
                ClientId = this.Configuration["googleId"],
                ClientSecret = this.Configuration["googleSecret"]
            };

            // Ensure secrets have been loaded.
            if (string.IsNullOrEmpty(googleOptions.ClientId) ||
                string.IsNullOrEmpty(googleOptions.ClientSecret))
            {
                throw new InvalidOperationException("Ensure googleId and googleSecret have been set with \"dotnet user-secrets set <key> <value>\"");
            }

            app.UseGoogleAuthentication(googleOptions);
        }

        /// <summary>
        /// Configures the Github external login provider.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureGithubAuthentication(IApplicationBuilder app)
        {
            var githubOptions = new GitHubAuthenticationOptions
            {
                ClientId = this.Configuration["githubId"],
                ClientSecret = this.Configuration["githubSecret"],
                Scope = { "user:login" }
            };

            // Ensure secrets have been loaded.
            if (string.IsNullOrEmpty(githubOptions.ClientId) ||
                string.IsNullOrEmpty(githubOptions.ClientSecret))
            {
                throw new InvalidOperationException("Ensure githubId and githubSecret have been set with \"dotnet user-secrets set <key> <value>\"");
            }

            app.UseGitHubAuthentication(githubOptions);
        }

        /// <summary>
        /// Configures the Microsoft external login provider.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureMicrosoftAuthentication(IApplicationBuilder app)
        {
            var microsoftOptions = new MicrosoftAccountOptions()
            {
                ClientId = this.Configuration["microsoftId"],
                ClientSecret = this.Configuration["microsoftSecret"]
            };

            // Ensure secrets have been loaded.
            if (string.IsNullOrEmpty(microsoftOptions.ClientId) ||
                string.IsNullOrEmpty(microsoftOptions.ClientSecret))
            {
                throw new InvalidOperationException("Ensure microsoftId and microsoftSecret have been set with \"dotnet user-secrets set <key> <value>\"");
            }

            app.UseMicrosoftAccountAuthentication(microsoftOptions);
        }

        /// <summary>
        /// Configures the Twitter external login provider.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureTwitterAuthentication(IApplicationBuilder app)
        {
            var twitterOptions = new TwitterOptions()
            {
                ConsumerKey = this.Configuration["twitterId"],
                ConsumerSecret = this.Configuration["twitterSecret"]
            };

            // Ensure secrets have been loaded.
            if (string.IsNullOrEmpty(twitterOptions.ConsumerKey) ||
                string.IsNullOrEmpty(twitterOptions.ConsumerSecret))
            {
                throw new InvalidOperationException("Ensure twitterId and twitterSecret have been set with \"dotnet user-secrets set <key> <value>\"");
            }

            app.UseTwitterAuthentication(twitterOptions);
        }

        /// <summary>
        /// Configures the Faceboook external login provider.
        /// </summary>
        /// <param name="app">The application configuration.</param>
        private void ConfigureFacebookAuthentication(IApplicationBuilder app)
        {
            var facebookOptions = new FacebookOptions()
            {
                AppId = this.Configuration["facebookId"],
                AppSecret = this.Configuration["facebookSecret"],

                // Use popup style for the challenge page.
                Events = new OAuthEvents()
                {
                    OnRedirectToAuthorizationEndpoint = (originalContext) =>
                    {
                        var context = new OAuthRedirectToAuthorizationContext(
                            originalContext.HttpContext,
                            originalContext.Options,
                            originalContext.Properties,
                            string.Format("{0}&display=popup", originalContext.RedirectUri));
                        
                        context.Response.Redirect(context.RedirectUri);
                        return System.Threading.Tasks.Task.FromResult(0);
                    }
                }
            };

            // Ensure secrets have been loaded.
            if (string.IsNullOrEmpty(facebookOptions.AppId) ||
                string.IsNullOrEmpty(facebookOptions.AppSecret))
            {
                throw new InvalidOperationException("Ensure facebookId and facebookSecret have been set with \"dotnet user-secrets set <key> <value>\"");
            }

            // Request only the public profile.
            facebookOptions.Scope.Clear();
            facebookOptions.Scope.Add("public_profile");

            // Request only the name claim.
            facebookOptions.Fields.Clear();
            facebookOptions.Fields.Add("name");

            app.UseFacebookAuthentication(facebookOptions);
        }
    }
}