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
using Microsoft.AspNetCore.StaticFiles;
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
                .AddJsonFile(Program.Settings, optional: false)
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
            if (env.IsDevelopment())
            {
                // Enable logging.
                loggerFactory.AddConsole(Configuration.GetSection("Logging"));
                loggerFactory.AddDebug();

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
            var customContentTypes = new FileExtensionContentTypeProvider();
            customContentTypes.Mappings[".obj"] = "text/plain";

            app.UseStaticFiles(new StaticFileOptions()
            {
                ContentTypeProvider = customContentTypes
            });

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
                    name: "default",
                    template: string.Empty,
                    defaults: new
                    {
                        controller = "Startup",
                        action = "Index"
                    }
                );

                // News Partial called by Angular template.
                routes.MapRoute(
                    name: "news-view",
                    template: "views/news/{id:int?}",
                    defaults: new
                    {
                        controller = "News",
                        action = "Index",
                        id = 0
                    }
                );

                // News.
                routes.MapRoute(
                    name: "news",
                    template: "news",
                    defaults: new
                    {
                        controller = "Startup",
                        action = "Index"
                    }
                );

                // Articles Partial called by Angular template.
                routes.MapRoute(
                    name: "articles-view",
                    template: "views/articles",
                    defaults: new
                    {
                        controller = "Articles",
                        action = "Index"
                    }
                );

                // Articles.
                routes.MapRoute(
                    name: "articles",
                    template: "articles",
                    defaults: new
                    {
                        controller = "Startup",
                        action = "Index"
                    }
                );

                // Projects Partial called by Angular template.
                routes.MapRoute(
                    name: "projects-view",
                    template: "views/projects",
                    defaults: new
                    {
                        controller = "Projects",
                        action = "Index"
                    }
                );

                // Projects.
                routes.MapRoute(
                    name: "projects",
                    template: "projects",
                    defaults: new
                    {
                        controller = "Startup",
                        action = "Index"
                    }
                );

                // About Partial called by Angular template.
                routes.MapRoute(
                    name: "about-view",
                    template: "views/about",
                    defaults: new
                    {
                        controller = "About",
                        action = "Index"
                    }
                );

                // About.
                routes.MapRoute(
                    name: "about",
                    template: "about",
                    defaults: new
                    {
                        controller = "Startup",
                        action = "Index"
                    }
                );
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
                return;
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
                return;
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
                return;
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
                return;
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
                return;
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
                return;
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
                return;
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
                return;
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
