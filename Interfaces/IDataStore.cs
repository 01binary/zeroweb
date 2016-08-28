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
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many items to return at most.</param>
        /// <param name="published">Whether to return only published items.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of site items</returns>
        IQueryable<SiteItem> GetItems(int days, int count, bool published, params string[] tags);

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many items to return at most.</param>
        /// <param name="author">The author to search for.</param>
        /// <param name="published">Whether to return only published items.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of site items</returns>
        IQueryable<SiteItem> GetItems(int days, int count, string author, bool published, params string[] tags);

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many items to return at most.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of site items</returns>
        IQueryable<SiteItem> GetItems(int days, int count, string search, params string[] tags);

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many items to return at most.</param>
        /// <param name="author">The author to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of site items</returns>
        IQueryable<SiteItem> GetItems(int days, int count, string author, string search, params string[] tags);

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="typeTag">The built-in tag to search for.</param>
        /// <returns>A list of site items</returns>
        IQueryable<SiteItem> GetItems(Tags typeTag);

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="typeTag">The built-in tag to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <returns>A list of site items</returns>
        IQueryable<SiteItem> GetItems(Tags typeTag, string search);

        /// <summary>
        /// Gets the tags.
        /// </summary>
        /// <returns>A list of tags</returns>
        IQueryable<Tag> GetTags();

        /// <summary>
        /// Gets a site item.
        /// </summary>
        /// <param name="id">The site item Id.</param>
        /// <returns>The site item requested or null if not found.</returns>
        SiteItem GetItem(int id);

        /// <summary>
        /// Gets the site item comments.
        /// </summary>
        /// <param name="id">The site item Id.</param>
        /// <returns>The comments for the site item.</returns>
        IQueryable<Comment[]> GetItemComments(int id);

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