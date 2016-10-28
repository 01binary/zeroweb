using System.IO;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using ZeroWeb.Shared;

namespace ZeroWeb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddCommandLine(args)
                .AddEnvironmentVariables(prefix: "ASPNETCORE_")
                .AddJsonFile(Shared.GetApplicationSettingsPath(), optional: false)
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
