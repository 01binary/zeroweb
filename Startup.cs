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
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
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
        /// Configures the faceboook external login provider.
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
