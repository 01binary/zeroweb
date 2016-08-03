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
                    tags = result.Metadata.Where(metadata => metadata.Tag.Name != excludeTag)
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

            return NotFound();
            
            return Ok(new
            {
                store.GetItem(id).Content
            });
        }
    }
}