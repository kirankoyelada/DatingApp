using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.headers
{
    public static class ExtensionHelper
    {
        public static void AddApplicationError(this HttpResponse response,string message)
        {
            response.Headers.Add("Application-Error",message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }

        public static void AddPagination(this HttpResponse response,int currentPage,int itemsPerPage,int totalItems, int totalPages)
        {
            var pagination=new PaginationHeader(currentPage,totalPages,itemsPerPage,totalItems);
            var camelCaseFormater=new JsonSerializerSettings();
            camelCaseFormater.ContractResolver=new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(pagination,camelCaseFormater));
            //response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
            response.Headers.Add("Access-Control-Expose-Headers","Pagination"); 
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