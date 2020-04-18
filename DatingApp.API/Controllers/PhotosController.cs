using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.DTOS;
using DatingApp.API.headers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userid}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IUserRepo userRepo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IUserRepo _userRepo, IMapper _mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            userRepo = _userRepo;
            mapper = _mapper;
            this.cloudinaryConfig = cloudinaryConfig;

            Account account = new Account
            (
                cloudinaryConfig.Value.CloudName,
                cloudinaryConfig.Value.APIKey,
                cloudinaryConfig.Value.APISecret
            );

            _cloudinary = new Cloudinary(account);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photorepo = await userRepo.GetPhoto(id);

            var photo = mapper.Map<PhotoForReturnDTO>(photorepo);

            return Ok(photo);

        }


        [HttpPost]
        public async Task<IActionResult> AddPhotosForUser(int userID, [FromForm] PhotosDTO photosDTO)
        {
            if (userID != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await userRepo.GetUser(userID);

            var file = photosDTO.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photosDTO.Url = uploadResult.Uri.ToString();
            photosDTO.PublicId = uploadResult.PublicId;

            var photo = mapper.Map<Photo>(photosDTO);

            if (!user.Photos.Any(u => u.isMain))
                photo.isMain = true;

            user.Photos.Add(photo);


            if (await userRepo.SaveAll())
            {
                var photoToReturn = mapper.Map<PhotoForReturnDTO>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id, userId = userID }, photoToReturn);
            }

            return BadRequest("Could not add photo :(");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainAsPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await userRepo.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
            var photoFromRepo = await userRepo.GetPhoto(id);

            if (photoFromRepo.isMain)
                return BadRequest("This is already main photo");

            var currentMainPhoto = await userRepo.GetMainPhoto(userId);

            currentMainPhoto.isMain = false;

            photoFromRepo.isMain = true;

            if (await userRepo.SaveAll())
                return NoContent();

            return BadRequest("Main Photo is not set due to some issues");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await userRepo.GetUser(userId);

            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
            var photoFromRepo = await userRepo.GetPhoto(id);

            if (photoFromRepo.isMain)
                return BadRequest("This is already main photo");

            //if public id is there delete from cludinary
            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                {
                    userRepo.Delete(photoFromRepo);
                }
        
            }

            //if no public id then delete from repo
            if(photoFromRepo.PublicId == null )
            {
                userRepo.Delete(photoFromRepo);
            }



            if (await userRepo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Unable to delete photo due to internal serer issue");
        }

    }

}