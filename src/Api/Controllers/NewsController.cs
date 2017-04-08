/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the News Endpoint.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ZeroWeb.Models;

namespace ZeroWeb.Api
{
    /// <summary>
    /// The News Endpoint.
    /// </summary>
    [Route("api/news")]
    public class NewsController: Controller
    {
        /// <summary>
        /// The site data store.
        /// </summary>
        IServiceProvider services;

        /// <summary>
        /// Initializes a new instance of the <see cref="NewsController"/> class.
        /// </summary>
        /// <param name="services">The application container.</param>
        public NewsController(IServiceProvider services)
        {
            this.services = services;
        }

        /// <summary>
        /// Gets the news stories.
        /// </summary>
        public IActionResult GetStories()
        {
            try
            {
                IDataStore store = this.services.GetService(typeof(IDataStore)) as IDataStore;
                string typeTag = Shared.FormatTag(TypeTags.Story);

                return this.Json(
                    store.GetArticles(typeTag).Select(story => new 
                    {
                        id = story.Id,
                        title = story.Title,
                        date = story.Date,
                        author = story.Author.Name,
                        tags = story.Metadata.Where(metadata => metadata.Tag.Name.ToLower() != typeTag)
                                            .Select(metadata => metadata.Tag.Name),
                        content = story.Content
                    })
                    .ToArray()
                    .Select(result => new
                    {
                        result.id,
                        title = result.title,
                        date = Shared.FormatDate(result.date),
                        author = result.author,
                        tags = result.tags.Select(tagName => Shared.FormatTag(tagName)),
                        content = result.content
                    }));
            }
            catch
            {
                return this.StatusCode(500);
            }
        }

        /// <summary>
        /// Star a news story.
        /// </summary>
        /// <param name="id">The story id</param>
        [HttpPost("star/{id}")]
        public IActionResult StarStory(int id)
        {
            try
            {
                IDataStore store = this.services.GetService(typeof(IDataStore)) as IDataStore;
                var story = store.GetArticle(id);

                if (story == null)
                {
                    return this.NotFound();
                }
                
                var storyStars = store.GetArticleStars(id);
                string excludeIpAddress = Shared.GetRequestIpAddress(this.Request);
                
                if (storyStars.Any(star => star.IpAddress == excludeIpAddress))
                {
                    return this.BadRequest();
                }
                
                story.Stars.Add(new Star(story, excludeIpAddress));
                store.Save();
                
                return this.Ok(new { stars = storyStars.Count() });
            }
            catch
            {
                return this.StatusCode(500);
            }
        }
    }
}