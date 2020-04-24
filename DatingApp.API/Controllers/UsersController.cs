 using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOS;
using DatingApp.API.headers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepo _userRepo;
        private readonly IMapper _mapper;

        public UsersController(IUserRepo userRepo, IMapper mapper)
        {
            _mapper = mapper;
            _userRepo = userRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUser=int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userRepo=await _userRepo.GetUser(currentUser);

            userParams.UserID=userRepo.Id;

            if(string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender= userRepo.Gender == "male" ? "female" : "male";
            }

            var users = await _userRepo.GerAllUser(userParams);

            var userToReturn=_mapper.Map<IEnumerable<UserListDTO>>(users);

            Response.AddPagination(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);

            return Ok(userToReturn);
        }

        [HttpGet("{id}",Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userRepo.GetUser(id);

            var userReturnData=_mapper.Map<UserListDetail>(user);

            return Ok(userReturnData);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDTO userForUpdateDTO)
        {
            if(id!=int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user=await _userRepo.GetUser(id);

            _mapper.Map(userForUpdateDTO,user);

            if(await _userRepo.SaveAll())
                return NoContent();

            throw new Exception($"Updating User {id} failed");
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if(id!=int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var like=await _userRepo.GetLike(id,recipientId);

            if(like !=null)
                return BadRequest("You already like this user");

            if(await _userRepo.GetUser(recipientId) == null)
                return NotFound();

            like=new Like
            {
                LikerId = id,
                LikeeId=recipientId
            };

            _userRepo.Add<Like>(like);

            if(await _userRepo.SaveAll())
                return Ok();
            
            return BadRequest("failed to like user");
        }
    }
}