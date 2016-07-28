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
        IDataStore store;

        /// <summary>
        /// Initializes a new instance of the <see cref="NewsService"/> class.
        /// </summary>
        /// <param name="store">The data store.</param>
        public NewsService(IDataStore store)
        {
            this.store = store;
        }

        /// <summary>
        /// Gets the news stories.
        /// </summary>
        public IActionResult Get()
        {
            // TODO: Store should support getting items with tags.
            // Find the news story tag.
            var newsTag = this.store.Tags.Where(
                tag => tag.Name == "story").FirstOrDefault();

            // Return an empty list if could not find the tag.
            if (newsTag == null)
            {
                return Json(new object[0]);
            }

            // Return site items with the news story tag.
            return Json(this.store.SiteItems
                .Where(item =>
                    item.Published == true &&
                    item.Metadata.Count(metadata => metadata.Tag == newsTag) > 0
                )
                .Select(story => new
                {
                    id = story.Id,
                    title = Shared.FormatTitle(story.Title),
                    date = Shared.FormatDate(story.Date),
                    author = story.Author.Name,
                    thumbnail = story.Thumbnail,
                    content = story.Content,
                    tags = story.Metadata.Where(metadata => metadata.Tag != newsTag)
                                         .Select(metadata => metadata.Tag.Name)
                }).ToList());
        }
    }
}