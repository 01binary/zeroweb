using System.IO;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace ZeroWeb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddCommandLine(args)
                .AddEnvironmentVariables(prefix: "ASPNETCORE_")
                .Build();

            var root = Directory.GetCurrentDirectory();
            var certificate = new X509Certificate2(
                Path.Combine(root, "Certificates", "01binary.us.crt"));

            var host = new WebHostBuilder()
                .UseConfiguration(config)
                .UseKestrel(options =>
                    options.UseHttps(certificate))
                .UseContentRoot(root)
                .UseIISIntegration()
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }
    }
}
