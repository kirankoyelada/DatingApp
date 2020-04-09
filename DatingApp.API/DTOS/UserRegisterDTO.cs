using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOS
{
    public class UserRegisterDTO
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(8, MinimumLength=3,ErrorMessage="Password length between 3 to 8 chargs")]
        public string Password { get; set; }
    }
}