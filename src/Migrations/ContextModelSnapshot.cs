using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using ZeroWeb.Models;

namespace zeroweb.Migrations
{
    [DbContext(typeof(Context))]
    partial class ContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.0-rtm-21431");

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole", b =>
                {
                    b.Property<string>("Id");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("NormalizedName")
                        .HasAnnotation("MaxLength", 256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("ZeroWeb.Models.Article", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AuthorId")
                        .IsRequired();

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("char");

                    b.Property<DateTime>("Date");

                    b.Property<string>("Key")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 128);

                    b.Property<double?>("LocationLatitude");

                    b.Property<double?>("LocationLongitude");

                    b.Property<string>("LocationName")
                        .HasAnnotation("MaxLength", 32);

                    b.Property<double?>("LocationZoom");

                    b.Property<bool>("Published");

                    b.Property<string>("Thumbnail")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 64);

                    b.Property<int>("Views");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("Key");

                    b.HasIndex("Date", "Published");

                    b.ToTable("Articles");
                });

            modelBuilder.Entity("ZeroWeb.Models.Assignment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("IssueId")
                        .IsRequired();

                    b.Property<int?>("TagId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("IssueId");

                    b.HasIndex("TagId");

                    b.ToTable("Assignments");
                });

            modelBuilder.Entity("ZeroWeb.Models.Comment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ArticleId")
                        .IsRequired();

                    b.Property<string>("Author")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 64);

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 256);

                    b.Property<DateTime>("Date");

                    b.Property<bool>("Published");

                    b.HasKey("Id");

                    b.HasIndex("ArticleId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("ZeroWeb.Models.Issue", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ArticleId")
                        .IsRequired();

                    b.Property<TimeSpan?>("BaselineDuration");

                    b.Property<DateTime?>("BaselineEnd");

                    b.Property<DateTime?>("BaselineStart");

                    b.Property<byte>("Complexity")
                        .HasColumnType("tinyint");

                    b.Property<int?>("DependencyId");

                    b.Property<TimeSpan?>("Duration");

                    b.Property<DateTime?>("End");

                    b.Property<int?>("ParentId");

                    b.Property<DateTime?>("Start");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 32);

                    b.HasKey("Id");

                    b.HasIndex("ArticleId");

                    b.HasIndex("DependencyId");

                    b.HasIndex("ParentId");

                    b.ToTable("Issues");
                });

            modelBuilder.Entity("ZeroWeb.Models.Metadata", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ArticleId")
                        .IsRequired();

                    b.Property<int?>("TagId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("ArticleId");

                    b.HasIndex("TagId");

                    b.ToTable("Metadata");
                });

            modelBuilder.Entity("ZeroWeb.Models.Star", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ArticleId")
                        .IsRequired();

                    b.Property<string>("IpAddress")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 16);

                    b.HasKey("Id");

                    b.HasIndex("ArticleId");

                    b.ToTable("Stars");
                });

            modelBuilder.Entity("ZeroWeb.Models.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description")
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 128);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 16);

                    b.Property<int?>("ParentId");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.HasIndex("ParentId");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("ZeroWeb.Models.User", b =>
                {
                    b.Property<string>("Id");

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("NormalizedUserName")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasAnnotation("MaxLength", 256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("ZeroWeb.Models.Vote", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Author")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 64);

                    b.Property<int?>("CommentId")
                        .IsRequired();

                    b.Property<int>("Value");

                    b.HasKey("Id");

                    b.HasIndex("CommentId");

                    b.ToTable("Votes");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("ZeroWeb.Models.User")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("ZeroWeb.Models.User")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ZeroWeb.Models.User")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.Article", b =>
                {
                    b.HasOne("ZeroWeb.Models.Tag", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.Assignment", b =>
                {
                    b.HasOne("ZeroWeb.Models.Issue", "Issue")
                        .WithMany("Assignments")
                        .HasForeignKey("IssueId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ZeroWeb.Models.Tag", "Tag")
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.Comment", b =>
                {
                    b.HasOne("ZeroWeb.Models.Article", "Article")
                        .WithMany("Comments")
                        .HasForeignKey("ArticleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.Issue", b =>
                {
                    b.HasOne("ZeroWeb.Models.Article", "Article")
                        .WithMany("Issues")
                        .HasForeignKey("ArticleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ZeroWeb.Models.Issue", "Dependency")
                        .WithMany()
                        .HasForeignKey("DependencyId");

                    b.HasOne("ZeroWeb.Models.Issue", "Parent")
                        .WithMany()
                        .HasForeignKey("ParentId");
                });

            modelBuilder.Entity("ZeroWeb.Models.Metadata", b =>
                {
                    b.HasOne("ZeroWeb.Models.Article", "Article")
                        .WithMany("Metadata")
                        .HasForeignKey("ArticleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ZeroWeb.Models.Tag", "Tag")
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.Star", b =>
                {
                    b.HasOne("ZeroWeb.Models.Article", "Article")
                        .WithMany("Stars")
                        .HasForeignKey("ArticleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.Tag", b =>
                {
                    b.HasOne("ZeroWeb.Models.Tag", "Parent")
                        .WithMany()
                        .HasForeignKey("ParentId");
                });

            modelBuilder.Entity("ZeroWeb.Models.Vote", b =>
                {
                    b.HasOne("ZeroWeb.Models.Comment", "Comment")
                        .WithMany("Votes")
                        .HasForeignKey("CommentId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
