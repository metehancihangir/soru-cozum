using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArapcaSoruApi.Data;
using ArapcaSoruApi.Models;

namespace ArapcaSoruApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // ──────────────────────────────────────────────────────────────
        // POST /api/auth/login
        // Body: { username, password }
        // ──────────────────────────────────────────────────────────────
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { error = "Kullanıcı adı ve şifre gereklidir." });

            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.Trim().ToLower());

            if (admin == null || !BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
            {
                return Unauthorized(new { error = "Geçersiz kullanıcı adı veya şifre." });
            }

            return Ok(new
            {
                username = admin.Username,
                role = admin.Role,
                forcePasswordChange = admin.ForcePasswordChange,
                id = admin.Id
            });
        }

        // ──────────────────────────────────────────────────────────────
        // POST /api/auth/change-password
        // Body: { username, oldPassword, newPassword }
        // ──────────────────────────────────────────────────────────────
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.NewPassword))
                return BadRequest(new { error = "Kullanıcı adı ve yeni şifre gereklidir." });

            if (request.NewPassword.Length < 6)
                return BadRequest(new { error = "Yeni şifre en az 6 karakter olmalıdır." });

            var admin = await _context.AdminUsers
                .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.Trim().ToLower());

            if (admin == null)
                return NotFound(new { error = "Kullanıcı bulunamadı." });

            // Eski şifre kontrolü (isteğe bağlı ama önerilir)
            if (!string.IsNullOrEmpty(request.OldPassword) && !BCrypt.Net.BCrypt.Verify(request.OldPassword, admin.PasswordHash))
            {
                return BadRequest(new { error = "Mevcut şifre hatalı." });
            }

            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            admin.ForcePasswordChange = false;

            await _context.AuditLogs.AddAsync(new AuditLog
            {
                AdminUsername = admin.Username,
                Action = "CHANGE_PASSWORD",
                Details = "Admin password updated successfully."
            });

            await _context.SaveChangesAsync();

            return Ok(new { message = "Şifre başarıyla değiştirildi." });
        }

        // ──────────────────────────────────────────────────────────────
        // GET /api/auth/admins
        // List bülümündeki tüm adminler
        // ──────────────────────────────────────────────────────────────
        [HttpGet("admins")]
        public async Task<IActionResult> GetAdmins()
        {
            var list = await _context.AdminUsers
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Role,
                    u.ForcePasswordChange,
                    u.CreatedAt
                })
                .OrderBy(u => u.Id)
                .ToListAsync();

            return Ok(list);
        }

        // ──────────────────────────────────────────────────────────────
        // POST /api/auth/admins
        // Yeni admin ekle (super_admin yetkisi gerektirir)
        // ──────────────────────────────────────────────────────────────
        [HttpPost("admins")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { error = "Kullanıcı adı ve geçici şifre gereklidir." });

            var exists = await _context.AdminUsers.AnyAsync(u => u.Username.ToLower() == request.Username.Trim().ToLower());
            if (exists)
                return BadRequest(new { error = "Bu kullanıcı adı zaten kullanılıyor." });

            var role = (request.Role == "super_admin") ? "super_admin" : "admin";

            var newAdmin = new AdminUser
            {
                Username = request.Username.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = role,
                ForcePasswordChange = true,
                CreatedAt = DateTime.UtcNow
            };

            await _context.AdminUsers.AddAsync(newAdmin);

            await _context.AuditLogs.AddAsync(new AuditLog
            {
                AdminUsername = request.CreatorUsername ?? "system",
                Action = "CREATE_ADMIN",
                Details = $"Created admin user '{newAdmin.Username}' with role '{role}'"
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = newAdmin.Id,
                username = newAdmin.Username,
                role = newAdmin.Role,
                forcePasswordChange = newAdmin.ForcePasswordChange
            });
        }

        // ──────────────────────────────────────────────────────────────
        // DELETE /api/auth/admins/{id}
        // Admin sil
        // ──────────────────────────────────────────────────────────────
        [HttpDelete("admins/{id}")]
        public async Task<IActionResult> DeleteAdmin(int id, [FromQuery] string? requesterUsername)
        {
            var admin = await _context.AdminUsers.FindAsync(id);
            if (admin == null)
                return NotFound(new { error = "Admin bulunamadı." });

            if (admin.Username.ToLower() == "admin")
                return BadRequest(new { error = "Ana (root) admin hesabı silinemez." });

            _context.AdminUsers.Remove(admin);

            await _context.AuditLogs.AddAsync(new AuditLog
            {
                AdminUsername = requesterUsername ?? "system",
                Action = "DELETE_ADMIN",
                Details = $"Deleted admin user '{admin.Username}'"
            });

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public record LoginRequest(string Username, string Password);
    public record ChangePasswordRequest(string Username, string? OldPassword, string NewPassword);
    public record CreateAdminRequest(string Username, string Password, string? Role, string? CreatorUsername);
}
