using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ZeroWeb
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
        }
        
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
            
            app.UseStaticFiles();
            app.UseMvc(routes =>
            {
                // Layout.
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
                    template: "news",
                    defaults: new
                    {
                        controller = "News",
                        action = "Index"
                    }
                );

                // Articles.
                routes.MapRoute(
                    name: "articles",
                    template: "articles",
                    defaults: new
                    {
                        controller = "Articles",
                        action = "Index"
                    }
                );

                // Projects.
                routes.MapRoute(
                    name: "projects",
                    template: "projects",
                    defaults: new
                    {
                        controller = "Projects",
                        action = "Index"
                    }
                );

                // About.
                routes.MapRoute(
                    name: "about",
                    template: "about",
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
