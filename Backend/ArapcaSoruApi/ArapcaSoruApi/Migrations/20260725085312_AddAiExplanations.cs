using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArapcaSoruApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAiExplanations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GroupId",
                table: "Questions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AiExplanations",
                columns: table => new
                {
                    GroupId = table.Column<int>(type: "int", nullable: false),
                    ExplanationText = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_unicode_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AiExplanations", x => x.GroupId);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_unicode_ci");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AiExplanations");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "Questions");
        }
    }
}
