using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace zeroweb.Migrations
{
    public partial class Stars : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Stars",
                table: "SiteItems",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Stars",
                table: "SiteItems");
        }
    }
}
