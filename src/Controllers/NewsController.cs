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
        /// <param name="story">Display a page with the specified story.</param>
        public IActionResult Index([FromQuery]string story)
        {
            string excludeTag = Tags.Story.ToString().ToLower();
            string excludeIpAddress = Shared.GetRequestIpAddress(this.Request);

            var articles = this.store.GetArticles(
                Tags.Story, 0, story);

            try
            {
                bool modified = false;

                foreach (Article article in articles)
                {
                    byte[] visit;

                    if (!this.HttpContext.Session.TryGetValue(article.Id.ToString(), out visit))
                    {
                        this.HttpContext.Session.Set(
                            article.Id.ToString(), new byte[] { 1 });
                            
                        article.Views++;
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

            return View(articles
                .Select(article => new
                {
                    id = article.Id,
                    title = article.Title,
                    key = article.Key,
                    date = article.Date,
                    author = article.Author.Name,
                    views = article.Views,
                    stars = article.Stars.Count,
                    starsReadOnly = article.Stars.Any(star => star.IpAddress == excludeIpAddress),
                    location = article.LocationName,
                    latitude = article.LocationLatitude,
                    longitude = article.LocationLongitude,
                    zoom = article.LocationZoom,
                    tags = article.Metadata
                        .Where(metadata => metadata.Tag.Name.ToLower() != excludeTag)
                        .Select(metadata => metadata.Tag.Name).ToArray()
                })
                .ToArray()
                .Select(result =>
                {
                    dynamic article = new ExpandoObject();
                    article.id = result.id;
                    article.title = result.title;
                    article.key = result.key;
                    article.date = result.date;
                    article.author = result.author;
                    article.views = result.views;
                    article.stars = result.stars;
                    article.starsReadOnly = result.starsReadOnly;
                    article.location = result.location;
                    article.latitude = result.latitude;
                    article.longitude = result.longitude;
                    article.zoom = result.zoom;
                    article.tags = result.tags;
                    return article;
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
