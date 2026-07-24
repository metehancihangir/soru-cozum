using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArapcaSoruApi.Models
{
    public class AdminUser
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // "super_admin" veya "admin"
        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "admin";

        // İlk girişte şifre değiştirme zorunluluğu
        public bool ForcePasswordChange { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
