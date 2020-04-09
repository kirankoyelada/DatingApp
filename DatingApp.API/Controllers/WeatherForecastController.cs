using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly DataContext objDataContext;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, DataContext objDataContext)
        {
            this.objDataContext = objDataContext;
            _logger = logger;

        }

        // [HttpGet]
        // public IEnumerable<WeatherForecast> Get()
        // {
        //     var rng = new Random();
        //     return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //     {
        //         Date = DateTime.Now.AddDays(index),
        //         TemperatureC = rng.Next(-20, 55),
        //         Summary = Summaries[rng.Next(Summaries.Length)]
        //     })
        //     .ToArray();
        // }
        [HttpGet]
        public async  Task<IActionResult> GetValues()
        {
            var values=await objDataContext.Values.ToListAsync();
            return Ok(values);
        }
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async  Task<IActionResult> GetValue(int id)
        {
            var value=await objDataContext.Values.FirstOrDefaultAsync(x=>x.Id ==  id);
            return Ok(value);
        }


    }


}
