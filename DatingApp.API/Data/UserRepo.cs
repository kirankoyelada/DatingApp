using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class UserRepo : IUserRepo
    {
        private readonly DataContext context;

        public UserRepo(DataContext _context)
        {
            context = _context;
        }
        public void Add<T>(T entity) where T : class
        {
            context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            context.Remove(entity);
        }

        public async Task<IEnumerable<User>> GerAllUser()
        {
            var users=await context.Users.Include(x=>x.Photos).ToListAsync();
            return users;
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            var result= await context.Photos.Where(u=>u.UserId== userId).FirstOrDefaultAsync(p=>p.isMain);
            return result;
        } 

        public async Task<Photo> GetPhoto(int id)
        {
            var photo=await context.Photos.FirstOrDefaultAsync(p=>p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int userID)
        {
            var user=await context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(u=>u.Id == userID);
            return user;
        }

        public async Task<bool> SaveAll()
        {
            return await context.SaveChangesAsync()>0 ;
        }
    }
}