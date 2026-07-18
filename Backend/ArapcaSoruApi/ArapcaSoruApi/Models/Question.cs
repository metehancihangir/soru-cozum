using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArapcaSoruApi.Models
{
    public class Question
    {
        // PK — auto-increment int
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Ders adı — Örn: "Arapça-2"
        [Required]
        [MaxLength(200)]
        public string CourseName { get; set; } = string.Empty;

        // Sınav türü — Örn: "Yaz Okulu", "Dönem Sonu"
        [Required]
        [MaxLength(100)]
        public string ExamType { get; set; } = string.Empty;

        // Sınav yılı — Örn: "2021" veya "2023-2024"
        [Required]
        [MaxLength(20)]
        public string Year { get; set; } = string.Empty;

        // React tarafında okunacak görsel yolu — Örn: "/images/arapca-2/yaz_okulu/2021/q1.png"
        [Required]
        [MaxLength(500)]
        public string ImagePath { get; set; } = string.Empty;

        // Doğru şık — Yalnızca "A", "B", "C", "D" veya "E"
        [Required]
        [MaxLength(1)]
        [RegularExpression("^[A-E]$", ErrorMessage = "CorrectOption must be one of A, B, C, D, or E.")]
        public string CorrectOption { get; set; } = string.Empty;
    }
}
