/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a site data store contract.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.Linq;
using ZeroWeb.Models;

namespace ZeroWeb
{
    /// <summary>
    /// Application data store contract.
    /// </summary>
    public interface IDataStore
    {
        /// <summary>
        /// Gets the site items.
        /// </summary>
        IQueryable<SiteItem> SiteItems { get; }

        /// <summary>
        /// Gets the tags.
        /// </summary>
        IQueryable<Tag> Tags { get; }

        /// <summary>
        /// Adds a new site item.
        /// </summary>
        /// <param name="item">The site item to add.</param>
        void Add(SiteItem item);

        /// <summary>
        /// Removes a site  item.
        /// </summary>
        /// <param name="item">The site item to remove.</param>
        void Remove(SiteItem item);

        /// <summary>
        /// Adds a new tag.
        /// </summary>
        /// <param name="tag">The tag to add.</param>
        void Add(Tag tag);

        /// <summary>
        /// Removes a tag.
        /// </summary>
        /// <param name="tag">The tag to remove.</param>
        void Remove(Tag tag);

        /// <summary>
        /// Saves changes.
        /// </summary>
        void Save();
    }
}