/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a site data store.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.Linq;
using Microsoft.Extensions.Configuration;
using ZeroWeb.Models;

namespace ZeroWeb
{
    /// <summary>
    /// Application data store.
    /// </summary>
    public class SiteDataStore : IDataStore
    {
        /// <summary>
        /// The entity framework database context.
        /// </summary>
        private Context context;

        /// <summary>
        /// Initializes a new instance of the <see cref="SiteDataStore"/> class.
        /// </summary>
        /// <param name="configuration">The application configuration</param>
        public SiteDataStore(IConfiguration configuration)
        {
            this.context = new Context(configuration);
        }

        /// <summary>
        /// Gets the site items.
        /// </summary>
        public IQueryable<SiteItem> SiteItems
        {
            get
            {
                return this.context.SiteItems;
            }
        }

        /// <summary>
        /// Gets the tags.
        /// </summary>
        public IQueryable<Tag> Tags
        {
            get
            {
                return this.context.Tags;
            }
        }

        /// <summary>
        /// Adds a new tag.
        /// </summary>
        /// <param name="tag">The tag to add.</param>
        public void Add(Tag tag)
        {
            this.context.Tags.Add(tag);
        }

        /// <summary>
        /// Adds a new site item.
        /// </summary>
        /// <param name="item">The site item to add.</param>
        public void Add(SiteItem item)
        {
            this.context.SiteItems.Add(item);
        }

        /// <summary>
        /// Removes a tag.
        /// </summary>
        /// <param name="tag">The tag to remove.</param>
        public void Remove(Tag tag)
        {
            this.context.Tags.Remove(tag);
        }

        /// <summary>
        /// Removes a site item.
        /// </summary>
        /// <param name="item">The site item to remove.</param>
        public void Remove(SiteItem item)
        {
            this.context.Remove(item);
        }

        /// <summary>
        /// Saves changes.
        /// </summary>
        public void Save()
        {
            this.context.SaveChanges();
        }
    }
}