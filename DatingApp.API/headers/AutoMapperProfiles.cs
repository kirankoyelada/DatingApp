using System.Linq;
using AutoMapper;
using DatingApp.API.DTOS;
using DatingApp.API.Models;

namespace DatingApp.API.headers
{
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User,UserListDetail>()
                .ForMember(dest=>dest.PhotoUrl,opt=>opt.MapFrom(src=>src.Photos.FirstOrDefault(x=>x.isMain).Url))
                .ForMember(dest=>dest.Age, opt=>opt.MapFrom(src=>src.DateOfBirth.CalculateAge()));
            CreateMap<User,UserListDTO>()
                .ForMember(dest=>dest.PhotoUrl,opt=>opt.MapFrom(src=>src.Photos.FirstOrDefault(x=>x.isMain).Url))
                .ForMember(dest=>dest.Age, opt=>opt.MapFrom(src=>src.DateOfBirth.CalculateAge()));
            CreateMap<Photo,PhotosForUserListDTO>();
            CreateMap<UserForUpdateDTO,User>();
            CreateMap<Photo,PhotoForReturnDTO>();
            CreateMap<PhotosDTO,Photo>();
            CreateMap<UserRegisterDTO,User>();
        }
    }
}