using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArapcaSoruApi.Models
{
    public class Question
    {
        // G-8: Id — PK, auto-increment
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // G-9: Soru metni — Required, longtext (Arapça için)
        [Required]
        [Column(TypeName = "longtext")]
        public string QuestionText { get; set; } = string.Empty;

        // G-10: A ve B şıkları — Required
        [Required]
        [Column(TypeName = "longtext")]
        public string OptionA { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "longtext")]
        public string OptionB { get; set; } = string.Empty;

        // G-11: C ve D şıkları — nullable (opsiyonel)
        [Column(TypeName = "longtext")]
        public string? OptionC { get; set; }

        [Column(TypeName = "longtext")]
        public string? OptionD { get; set; }

        // G-12: E şıkkı — nullable, beşinci şık opsiyonel
        [Column(TypeName = "longtext")]
        public string? OptionE { get; set; }

        // G-13: Doğru şık harfi — Required, max 1 karakter ("A"/"B"/"C"/"D"/"E")
        [Required]
        [MaxLength(1)]
        public string CorrectOption { get; set; } = string.Empty;

        // G-14: Yanlış cevapta gösterilecek çözüm açıklaması — nullable
        [Column(TypeName = "longtext")]
        public string? Explanation { get; set; }

        // G-15: Kayıt tarihi — default: UTC şimdiki zaman
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
