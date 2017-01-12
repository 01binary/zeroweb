using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace ZeroWeb
{
    public class Program
    {
        public static readonly string Settings = "Properties/appsettings.json";
        
        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddCommandLine(args)
                .AddEnvironmentVariables(prefix: "ASPNETCORE_")
                .AddJsonFile(Settings, optional: false)
                .Build();

            var host = new WebHostBuilder()
                .UseConfiguration(config)
                .UseKestrel(options =>
                {
                    options.UseHttps(config["cert"], config["password"]);
                    options.UseConnectionLogging();
                })
                .UseUrls(config["url"])
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseWebRoot(Path.Combine(Directory.GetCurrentDirectory(), config["webroot"]))
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }
    }
}
