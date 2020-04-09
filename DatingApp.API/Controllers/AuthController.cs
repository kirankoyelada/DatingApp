using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.DTOS;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController:ControllerBase
    {
        private readonly IAuthRepo _authRepo;
        private readonly IConfiguration _config;

        public AuthController(IAuthRepo authRepo,IConfiguration  config)
        {
            _authRepo = authRepo;
            _config = config;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserRegisterDTO userRegisterDTO)
        {
            userRegisterDTO.UserName=userRegisterDTO.UserName.ToLower();
            if(await _authRepo.UserExists(userRegisterDTO.UserName))
                return BadRequest("User already exists");
            User objUser=new User()
            {
                Username=userRegisterDTO.UserName
            };

            var CreatedUser=await _authRepo.Resiger(objUser,userRegisterDTO.Password);

            return StatusCode(201);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            loginDTO.UserName=loginDTO.UserName.ToLower(); //convet username to lowercase for verification purppose
            
            var user= await _authRepo.Login(loginDTO.UserName,loginDTO.Password);

            if(user == null)
                return BadRequest("User Not Exists");
            //based on login we are creating claims
            var claims=new []
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name,user.Username)
            };
            // this is key we need to get from config file and convet into bytes
            var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            //
            var cred=new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            //token expire
            var tokenDesc=new SecurityTokenDescriptor
            {
                Subject=new ClaimsIdentity(claims),
                Expires=DateTime.Now.AddDays(1),
                SigningCredentials=cred
            };

            var tokenHandler=new JwtSecurityTokenHandler();
            
            //jwt token
            var token=tokenHandler.CreateToken(tokenDesc);

            return Ok(new {
                token=tokenHandler.WriteToken(token)
            });

        }
    }
}