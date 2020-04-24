using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options):base(options)
        { }

        public DbSet<Values> Values { get; set; }

        public DbSet<User> Users{get;set;}

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Like> Likes {get;set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Like>()
                        .HasKey(k=> new {k.LikerId, k.LikeeId});

            modelBuilder.Entity<Like>()
                        .HasOne(u=>u.Likee)
                        .WithMany(u=>u.Likers)
                        .HasForeignKey(f=>f.LikeeId)
                        .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Like>()
                        .HasOne(u=>u.Liker)
                        .WithMany(u=>u.Likes)
                        .HasForeignKey(f=>f.LikerId)
                        .OnDelete(DeleteBehavior.Restrict);
                        
        }
    }
}