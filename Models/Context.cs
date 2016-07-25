/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Application database context.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Application database context.
    /// </summary>
    public class Context : DbContext
    {
        /// <summary>
        /// The application configuration.
        /// </summary>
        private IConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="Context"/> class.
        /// </summary>
        /// <param name="configuration">
        public Context(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        /// Gets or sets news, articles, and projects.
        /// </summary>
        public DbSet<SiteItem> SiteItems { get; set; }

        /// <summary>
        /// Configures the context.
        /// </summary>
        /// <param name="optionsBuilder">The configuration interface.</param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(
                ConfigurationExtensions.GetConnectionString(this.configuration, "ZeroDatabase"),
                options => options.MigrationsAssembly("zeroweb"));
        }

        /// <summary>
        /// Creates database structure not supported with Annotations using Fluent syntax.
        /// </summary>
        /// <param name="optionsBuilder">The configuration interface.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Create index IX_SiteItems_Date_Published.
            modelBuilder.Entity<SiteItem>()
                        .HasIndex(siteItem => new { siteItem.Date, siteItem.Published })
                        .IsUnique(false);

            // Create index UX_Tags_Name.
            modelBuilder.Entity<Tag>()
                        .HasIndex(tag => tag.Name)
                        .IsUnique(true);
            
            // Create foreign key from Task.Parent to Task.Id.
            modelBuilder.Entity<Task>()
                        .HasOne(task => task.Parent)
                        .WithMany()
                        .HasForeignKey(task => task.ParentId);

            // Create foreign key from Task.Dependency to Task.Id.
            modelBuilder.Entity<Task>()
                        .HasOne(task => task.Dependency)
                        .WithMany()
                        .HasForeignKey(task => task.DependencyId);
        }
    }
}