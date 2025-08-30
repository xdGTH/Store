using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class ApplicationUser : IdentityUser<int>
    {
        public UserAddress Address { get; set; }
    }
}