using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArapcaSoruApi.Models
{
    public class Question : IValidatableObject
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
        [RegularExpression("^[A-E]$", ErrorMessage = "CorrectOption must be one of A, B, C, D, or E.")]
        public string CorrectOption { get; set; } = string.Empty;

        // G-14: Yanlış cevapta gösterilecek çözüm açıklaması — nullable
        [Column(TypeName = "longtext")]
        public string? Explanation { get; set; }

        // G-15: Kayıt tarihi — default: UTC şimdiki zaman
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (string.IsNullOrWhiteSpace(CorrectOption))
                yield break;

            var optionText = CorrectOption.ToUpperInvariant() switch
            {
                "A" => OptionA,
                "B" => OptionB,
                "C" => OptionC,
                "D" => OptionD,
                "E" => OptionE,
                _ => null
            };

            if (string.IsNullOrWhiteSpace(optionText))
            {
                yield return new ValidationResult(
                    "CorrectOption must reference a non-empty option.",
                    [nameof(CorrectOption)]
                );
            }
        }
    }
}
