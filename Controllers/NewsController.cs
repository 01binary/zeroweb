/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  News server-side controller.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.Dynamic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ZeroWeb.Models;

namespace ZeroWeb.Controllers
{
    /// <summary>
    /// News controller.
    /// </summary>
    public class NewsController : Controller
    {
        /// <summary>
        /// The data store for getting news stories.
        /// </summary>
        IDataStore store;

        /// <summary>
        /// Initializes a new instance of the <see cref="NewsController"/> class.
        /// </summary>
        /// <param name="store">The data store</param>
        public NewsController(IDataStore store)
        {
            this.store = store;
        }

        /// <summary>
        /// Default action.
        /// </summary>
        public IActionResult Index()
        {
            string excludeTag = Tags.Story.ToString().ToLower();
            string excludeIpAddress = Shared.GetRequestIpAddress(this.Request);

            var stories = this.store.GetArticles(Tags.Story);

            try
            {
                bool modified = false;

                foreach (Article story in stories)
                {
                    byte[] visit;

                    if (!this.HttpContext.Session.TryGetValue(story.Id.ToString(), out visit))
                    {
                        this.HttpContext.Session.Set(
                            story.Id.ToString(), new byte[] { 1 });
                            
                        story.Views++;
                        modified = true;
                    }
                }

                if (modified)
                {
                    this.store.Save();
                }
            }
            catch
            {
            }

            return View(stories
                .Select(story => new
                {
                    id = story.Id,
                    title = story.Title,
                    date = story.Date,
                    author = story.Author.Name,
                    views = story.Views,
                    stars = story.Stars.Count,
                    starsReadOnly = story.Stars.Any(star => star.IpAddress == excludeIpAddress),
                    location = story.LocationName,
                    latitude = story.LocationLatitude,
                    longitude = story.LocationLongitude,
                    zoom = story.LocationZoom,
                    tags = story.Metadata
                        .Where(metadata => metadata.Tag.Name.ToLower() != excludeTag)
                        .Select(metadata => metadata.Tag.Name).ToArray()
                })
                .ToArray()
                .Select(result =>
                {
                    dynamic story = new ExpandoObject();
                    story.id = result.id;
                    story.title = result.title;
                    story.date = result.date;
                    story.author = result.author;
                    story.views = result.views;
                    story.stars = result.stars;
                    story.starsReadOnly = result.starsReadOnly;
                    story.location = result.location;
                    story.latitude = result.latitude;
                    story.longitude = result.longitude;
                    story.zoom = result.zoom;
                    story.tags = result.tags;
                    return story;
                }));
        }

        /// <summary>
        /// Error action.
        /// </summary>
        public IActionResult Error()
        {
            return View();
        }
    }
}
