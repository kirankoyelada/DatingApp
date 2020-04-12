using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.headers
{
    public static class ExtensionHelper
    {
        public static void AddApplicationError(this HttpResponse response,string message)
        {
            response.Headers.Add("Application-Error",message);
            response.Headers.Add("Access-Control.Expose.Header","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }

        public static int CalculateAge(this DateTime DOB)
        {
            int age=DateTime.Now.Year-DOB.Year;

            if(DOB.AddYears(age) > DateTime.Today)
            {
                age--;
            }

            return age;
            
        }
    }
}