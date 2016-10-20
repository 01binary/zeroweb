using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace zeroweb.Migrations
{
    public partial class StarsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Stars",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Autoincrement", true),
                    IpAddress = table.Column<string>(type: "char", maxLength: 16, nullable: false),
                    ItemId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stars", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stars_SiteItems_ItemId",
                        column: x => x.ItemId,
                        principalTable: "SiteItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Stars_ItemId",
                table: "Stars",
                column: "ItemId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Stars");
        }
    }
}
