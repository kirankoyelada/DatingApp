using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.headers;
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

        public async Task<PageList<User>> GerAllUser(UserParams userParams)
        {
            var users=context.Users.Include(x=>x.Photos).OrderByDescending(o=>o.LastActive).AsQueryable();

            users=users.Where(u=>u.Id != userParams.UserID);

            users=users.Where(g=>g.Gender == userParams.Gender);

            if(userParams.Likers)
            {
                var userLikers=await GetUserLikes(userParams.UserID,userParams.Likers);
                users=users.Where(u=>userLikers.Contains(u.Id));
            }

            if(userParams.Likees)
            {
                var userLikees=await GetUserLikes(userParams.UserID,userParams.Likers);
                users=users.Where(u=>userLikees.Contains(u.Id));
            }

            if(userParams.MinAge!=18 || userParams.MaxAge!=99)
            {
                var minDob=DateTime.Now.AddYears(-userParams.MaxAge);

                var maxDob=DateTime.Now.AddYears(-userParams.MinAge);

                users= users.Where(age=>age.DateOfBirth >= minDob && age.DateOfBirth <= maxDob);
            }

            if(!string.IsNullOrEmpty(userParams.OrderBy))
            {
               switch(userParams.OrderBy)
               {
                   case "created":
                                users=users.OrderByDescending(u=>u.Created);
                                break;
                                default:users=users.OrderByDescending(u=>u.LastActive);
                                break;
               }
            }


            return await PageList<User>.CreateAsync(users,userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int userId, bool likes)
        {
            var user=await context.Users.Include(x=>x.Likers).Include(x=>x.Likes)
                        .FirstOrDefaultAsync(u=>u.Id== userId);
            if(likes)
            {
                return user.Likers.Where(u=>u.LikeeId == userId).Select(u=>u.LikerId);
            }
            else
            {
                return user.Likes.Where(x=>x.LikerId == userId).Select(u=>u.LikeeId);
            }

        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await context.Likes.FirstOrDefaultAsync(u=>u.LikerId == userId && u.LikeeId == recipientId);
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