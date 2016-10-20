/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  News API.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ZeroWeb;
using ZeroWeb.Models;

namespace ZeroWeb.API
{
    /// <summary>
    /// News API.
    /// </summary>
    [Route("services/news")]
    public class NewsService: Controller
    {
        /// <summary>
        /// The site data store.
        /// </summary>
        IServiceProvider services;

        /// <summary>
        /// Initializes a new instance of the <see cref="NewsService"/> class.
        /// </summary>
        /// <param name="services">The application container.</param>
        public NewsService(IServiceProvider services)
        {
            this.services = services;
        }

        /// <summary>
        /// Gets the news stories.
        /// </summary>
        public IActionResult GetStories()
        {
            IDataStore store = this.services.GetService(typeof(IDataStore)) as IDataStore;
            string excludeTag = Tags.Story.ToString().ToLower();

            return Json(
                store.GetItems(Tags.Story).Select(result => new 
                {
                    id = result.Id,
                    title = result.Title,
                    date = result.Date,
                    author = result.Author.Name,
                    tags = result.Metadata.Where(metadata => metadata.Tag.Name.ToLower() != excludeTag)
                                          .Select(metadata => metadata.Tag.Name),
                    content = result.Content
                }).ToArray().Select(final => new
                {
                    final.id,
                    title = Shared.FormatTitle(final.title),
                    date = Shared.FormatDate(final.date),
                    author = final.author,
                    tags = final.tags.Select(tagName => Shared.FormatTag(tagName)),
                    content = final.content
                }));
        }

        /// <summary>
        /// Gets the news story markdown content.
        /// </summary>
        /// <param name="id">The story id</param>
        [Route("{id}")]
        public IActionResult GetStory(int id)
        {
            IDataStore store = this.services.GetService(typeof(IDataStore)) as IDataStore;
            var item = store.GetItem(id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(new { store.GetItem(id).Content });
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
                SiteItem item = store.GetItem(id);

                if (item == null)
                {
                    return this.NotFound();
                }
                
                IQueryable<Star> itemStars = store.GetItemStars(id);
                string excludeIpAddress = Shared.GetRequestIpAddress(this.Request);
                
                if (itemStars.Any(star => star.IpAddress == excludeIpAddress))
                {
                    return this.BadRequest();
                }
                
                item.Stars.Add(new Star(item, excludeIpAddress));
                store.Save();
                
                return this.Ok(new { stars = itemStars.Count() });
            }
            catch (Exception ex)
            {
                return this.StatusCode(500);
            }
        }
    }
}