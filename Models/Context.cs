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

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Application database context.
    /// </summary>
    public class Context : IdentityDbContext<User>
    {
        /// <summary>
        /// The application configuration.
        /// </summary>
        private IConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="Context"/> class.
        /// </summary>
        /// <param name="configuration">The application configuration</param>
        public Context(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        /// Gets or sets news, articles, and projects.
        /// </summary>
        public DbSet<SiteItem> SiteItems { get; set; }

        /// <summary>
        /// Gets or sets comments.
        /// </summary>
        public DbSet<Comment> Comments { get; set; }

        /// <summary>
        /// Gets or sets the site item stars.
        /// </summary>
        public DbSet<Star> Stars { get; set; }

        /// <summary>
        /// Gets or sets the site item comment votes.
        /// </summary>
        public DbSet<Vote> Votes { get; set; }

        /// <summary>
        /// Gets or sets the tag taxonomy.
        /// </summary>
        public DbSet<Tag> Tags { get; set; }

        /// <summary>
        /// Configures the context.
        /// </summary>
        /// <param name="optionsBuilder">The configuration interface.</param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(
                this.configuration.GetConnectionString("ZeroDatabase"),
                options => options.MigrationsAssembly("zeroweb"));
        }

        /// <summary>
        /// Creates database structure not supported with Annotations using Fluent syntax.
        /// </summary>
        /// <param name="optionsBuilder">The configuration interface.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Describe the Owin Identity context we are deriving from.
            base.OnModelCreating(modelBuilder);

            // Create foreign key from Comment.Id to Vote.CommentId.
            modelBuilder.Entity<Comment>()
                .HasMany(comment => comment.Votes);

            // Create index IX_SiteItems_Date_Published.
            modelBuilder.Entity<SiteItem>()
                        .HasIndex(siteItem => new { siteItem.Date, siteItem.Published })
                        .IsUnique(false);

            // Create index UX_Tags_Name.
            modelBuilder.Entity<Tag>()
                        .HasIndex(tag => tag.Name)
                        .IsUnique(true);

            // Create foreign key from Tag.ParentId to Tag.Id.
            modelBuilder.Entity<Tag>()
                        .HasOne(tag => tag.Parent)
                        .WithMany()
                        .HasForeignKey(tag => tag.ParentId);
            
            // Create foreign key from Task.ParentId to Task.Id.
            modelBuilder.Entity<Task>()
                        .HasOne(task => task.Parent)
                        .WithMany()
                        .HasForeignKey(task => task.ParentId);

            // Create foreign key from Task.DependencyId to Task.Id.
            modelBuilder.Entity<Task>()
                        .HasOne(task => task.Dependency)
                        .WithMany()
                        .HasForeignKey(task => task.DependencyId);
        }
    }
}