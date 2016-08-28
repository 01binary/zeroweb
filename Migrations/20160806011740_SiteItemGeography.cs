using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace zeroweb.Migrations
{
    public partial class SiteItemGeography : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "LocationLatitude",
                table: "SiteItems",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "LocationLongitude",
                table: "SiteItems",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocationName",
                table: "SiteItems",
                maxLength: 32,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocationLatitude",
                table: "SiteItems");

            migrationBuilder.DropColumn(
                name: "LocationLongitude",
                table: "SiteItems");

            migrationBuilder.DropColumn(
                name: "LocationName",
                table: "SiteItems");
        }
    }
}
