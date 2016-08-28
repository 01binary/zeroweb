using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using ZeroWeb.Models;

namespace zeroweb.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20160806011740_SiteItemGeography")]
    partial class SiteItemGeography
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.0-rtm-21431");

            modelBuilder.Entity("ZeroWeb.Models.Comment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Author")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 64);

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 256);

                    b.Property<DateTime>("Date");

                    b.Property<int?>("ItemId")
                        .IsRequired();

                    b.Property<bool>("Published");

                    b.HasKey("Id");

                    b.HasIndex("ItemId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("ZeroWeb.Models.SiteItem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AuthorId")
                        .IsRequired();

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("char");

                    b.Property<DateTime>("Date");

                    b.Property<int?>("LocationLatitude");

                    b.Property<int?>("LocationLongitude");

                    b.Property<string>("LocationName")
                        .HasAnnotation("MaxLength", 32);

                    b.Property<bool>("Published");

                    b.Property<string>("Thumbnail")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 64);

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("Date", "Published");

                    b.ToTable("SiteItems");
                });

            modelBuilder.Entity("ZeroWeb.Models.SiteItemMetadata", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ItemId")
                        .IsRequired();

                    b.Property<int?>("TagId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("ItemId");

                    b.HasIndex("TagId");

                    b.ToTable("SiteItemMetadata");
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

            modelBuilder.Entity("ZeroWeb.Models.Task", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<TimeSpan?>("BaselineDuration");

                    b.Property<DateTime?>("BaselineEnd");

                    b.Property<DateTime?>("BaselineStart");

                    b.Property<byte>("Complexity")
                        .HasColumnType("tinyint");

                    b.Property<int?>("DependencyId");

                    b.Property<TimeSpan?>("Duration");

                    b.Property<DateTime?>("End");

                    b.Property<int?>("ItemId")
                        .IsRequired();

                    b.Property<int?>("ParentId");

                    b.Property<DateTime?>("Start");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("char")
                        .HasAnnotation("MaxLength", 32);

                    b.HasKey("Id");

                    b.HasIndex("DependencyId");

                    b.HasIndex("ItemId");

                    b.HasIndex("ParentId");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("ZeroWeb.Models.TaskAssignment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AssignmentId")
                        .IsRequired();

                    b.Property<int?>("TaskId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("AssignmentId");

                    b.HasIndex("TaskId");

                    b.ToTable("TaskAssignments");
                });

            modelBuilder.Entity("ZeroWeb.Models.TaskMetadata", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("TagId")
                        .IsRequired();

                    b.Property<int?>("TaskId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("TagId");

                    b.HasIndex("TaskId");

                    b.ToTable("TaskMetadata");
                });

            modelBuilder.Entity("ZeroWeb.Models.Comment", b =>
                {
                    b.HasOne("ZeroWeb.Models.SiteItem", "Item")
                        .WithMany("Comments")
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.SiteItem", b =>
                {
                    b.HasOne("ZeroWeb.Models.Tag", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.SiteItemMetadata", b =>
                {
                    b.HasOne("ZeroWeb.Models.SiteItem", "Item")
                        .WithMany("Metadata")
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ZeroWeb.Models.Tag", "Tag")
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.Tag", b =>
                {
                    b.HasOne("ZeroWeb.Models.Tag", "Parent")
                        .WithMany()
                        .HasForeignKey("ParentId");
                });

            modelBuilder.Entity("ZeroWeb.Models.Task", b =>
                {
                    b.HasOne("ZeroWeb.Models.Task", "Dependency")
                        .WithMany()
                        .HasForeignKey("DependencyId");

                    b.HasOne("ZeroWeb.Models.SiteItem", "Item")
                        .WithMany("Tasks")
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ZeroWeb.Models.Task", "Parent")
                        .WithMany()
                        .HasForeignKey("ParentId");
                });

            modelBuilder.Entity("ZeroWeb.Models.TaskAssignment", b =>
                {
                    b.HasOne("ZeroWeb.Models.Tag", "Assignment")
                        .WithMany()
                        .HasForeignKey("AssignmentId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ZeroWeb.Models.Task", "Task")
                        .WithMany("Assignments")
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ZeroWeb.Models.TaskMetadata", b =>
                {
                    b.HasOne("ZeroWeb.Models.Tag", "Tag")
                        .WithMany()
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ZeroWeb.Models.Task", "Task")
                        .WithMany("Metadata")
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
