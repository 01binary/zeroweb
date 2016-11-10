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
        public DbSet<Article> Articles { get; set; }

        /// <summary>
        /// Gets or sets project issues.
        /// </summary>
        public DbSet<Issue> Issues { get; set; }

        /// <summary>
        /// Gets or sets comments.
        /// </summary>
        public DbSet<Comment> Comments { get; set; }

        /// <summary>
        /// Gets or sets the article stars.
        /// </summary>
        public DbSet<Star> Stars { get; set; }

        /// <summary>
        /// Gets or sets the article comment votes.
        /// </summary>
        public DbSet<Vote> Votes { get; set; }

        /// <summary>
        /// Gets or sets the tag taxonomy.
        /// </summary>
        public DbSet<Tag> Tags { get; set; }

        /// <summary>
        /// Gets or sets project issue assignments.
        /// </summary>
        public DbSet<Assignment> Assignments { get; set; }

        /// <summary>
        /// Configures the context.
        /// </summary>
        /// <param name="optionsBuilder">The configuration interface.</param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(
                this.configuration.GetConnectionString("ZeroDatabase"),
                options => options.MigrationsAssembly("src"));
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

            // Create index IX_Articles_Date_Published.
            modelBuilder.Entity<Article>()
                .HasIndex(article => new { article.Date, article.Published })
                .IsUnique(false);

            // Create index IX_Articles_Key.
            modelBuilder.Entity<Article>()
                .HasIndex(article => article.Key);

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
            modelBuilder.Entity<Issue>()
                .HasOne(issue => issue.Parent)
                .WithMany()
                .HasForeignKey(issue => issue.ParentId);

            // Create foreign key from Task.DependencyId to Task.Id.
            modelBuilder.Entity<Issue>()
                .HasOne(issue => issue.Dependency)
                .WithMany()
                .HasForeignKey(issue => issue.DependencyId);
        }
    }
}