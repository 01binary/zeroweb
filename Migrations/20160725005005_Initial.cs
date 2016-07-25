using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace zeroweb.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Autoincrement", true),
                    Description = table.Column<string>(type: "char", maxLength: 128, nullable: true),
                    Name = table.Column<string>(type: "char", maxLength: 16, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteItems",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Autoincrement", true),
                    AuthorId = table.Column<int>(nullable: false),
                    Content = table.Column<string>(type: "char", nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    Published = table.Column<bool>(nullable: false),
                    Thumbnail = table.Column<string>(type: "char", maxLength: 256, nullable: false),
                    Title = table.Column<string>(type: "char", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SiteItems_Tags_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SiteItemMetadata",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Autoincrement", true),
                    ItemId = table.Column<int>(nullable: false),
                    TagId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteItemMetadata", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SiteItemMetadata_SiteItems_ItemId",
                        column: x => x.ItemId,
                        principalTable: "SiteItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SiteItemMetadata_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Autoincrement", true),
                    BaselineDuration = table.Column<TimeSpan>(nullable: true),
                    BaselineEnd = table.Column<DateTime>(nullable: true),
                    BaselineStart = table.Column<DateTime>(nullable: true),
                    Complexity = table.Column<byte>(type: "tinyint", nullable: false),
                    DependencyId = table.Column<int>(nullable: true),
                    Duration = table.Column<TimeSpan>(nullable: true),
                    End = table.Column<DateTime>(nullable: true),
                    ItemId = table.Column<int>(nullable: false),
                    ParentId = table.Column<int>(nullable: true),
                    Start = table.Column<DateTime>(nullable: true),
                    Title = table.Column<string>(type: "char", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tasks_Tasks_DependencyId",
                        column: x => x.DependencyId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tasks_SiteItems_ItemId",
                        column: x => x.ItemId,
                        principalTable: "SiteItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tasks_Tasks_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TaskAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Autoincrement", true),
                    AssignmentId = table.Column<int>(nullable: false),
                    TaskId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskAssignments_Tags_AssignmentId",
                        column: x => x.AssignmentId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TaskAssignments_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaskMetadata",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Autoincrement", true),
                    TagId = table.Column<int>(nullable: false),
                    TaskId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskMetadata", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskMetadata_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TaskMetadata_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SiteItems_AuthorId",
                table: "SiteItems",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_SiteItems_Date_Published",
                table: "SiteItems",
                columns: new[] { "Date", "Published" });

            migrationBuilder.CreateIndex(
                name: "IX_SiteItemMetadata_ItemId",
                table: "SiteItemMetadata",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_SiteItemMetadata_TagId",
                table: "SiteItemMetadata",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_Name",
                table: "Tags",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_DependencyId",
                table: "Tasks",
                column: "DependencyId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ItemId",
                table: "Tasks",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ParentId",
                table: "Tasks",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskAssignments_AssignmentId",
                table: "TaskAssignments",
                column: "AssignmentId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskAssignments_TaskId",
                table: "TaskAssignments",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskMetadata_TagId",
                table: "TaskMetadata",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskMetadata_TaskId",
                table: "TaskMetadata",
                column: "TaskId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SiteItemMetadata");

            migrationBuilder.DropTable(
                name: "TaskAssignments");

            migrationBuilder.DropTable(
                name: "TaskMetadata");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "SiteItems");

            migrationBuilder.DropTable(
                name: "Tags");
        }
    }
}
