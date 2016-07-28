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

using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
            services.AddOptions();
            services.AddSingleton<IConfiguration>(this.Configuration);
            services.AddDbContext<Context>();
            services.AddSingleton(typeof(IDataStore), typeof(SiteDataStore));
            
        }
        
        /// <summary>
        /// Configures the injected dependencies.
        /// </summary>
        /// <param name="app">
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            
            // Setup static resource routes.
            app.UseStaticFiles();

            // Add middleware handler to redirect Angular routes to Startup controller.
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

            // Setup layout and partial routes.
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
    }
}
