using System;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepo : IAuthRepo
    {
        private readonly DataContext _context;
        public AuthRepo(DataContext _context)
        {
            this._context = _context;

        }
        public async Task<User> Login(string username, string password)
        {
            var user=await _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x=>x.Username == username);

            if(user == null)
                return null;
            // if(!VerifyPasswordHash(password,user.PasswordSalt,user.PasswordHash))
            // {
            //     return null;
            // }
            return user;

        }

        private bool VerifyPasswordHash(string password, byte[] passwordSalt, byte[] passwordHash)
        {
          using(var hash=new System.Security.Cryptography.HMACSHA512())
          {
              var computedHash=hash.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

              for(int i=0;i<computedHash.Length;i++)
              {
                  if(computedHash[i] != passwordHash[i]) return false;
              }
          }
          return true;  
        }

        public async Task<User> Resiger(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash,out passwordSalt);

            user.PasswordHash=passwordHash;
            user.PasswordSalt=passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hash=new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt=hash.Key;
                passwordHash=hash.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
            if(await _context.Users.AnyAsync(x=>x.Username ==  username)) return true;

            return false;
        }
    }
}