namespace Server
{
    using Carter;
    using Microsoft.AspNetCore.Http;

    public class HomeModule : CarterModule
    {
        public HomeModule()
        {
            Get("/", async(req, res, routeData) => await res.WriteAsync("Hello from Carter!"));

            Get("/validate/{word}", async(req, res, routeData) => {
              var word = routeData.word;
              res.AsJson(new {
                  myWord = word
              });
            });
        }
    }
}
