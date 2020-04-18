using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IUserRepo
    {
        void Add<T>(T entity) where T:class;

        void Delete<T>(T entity) where T:class;

        Task<bool> SaveAll();

        Task<IEnumerable<User>> GerAllUser();

        Task<Photo> GetPhoto(int id);

        Task<User> GetUser(int userID);

        Task<Photo> GetMainPhoto(int userId);
    }
}