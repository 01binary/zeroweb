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

using System;
using System.Collections.Generic;
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
        /// The default max. number of site items to query.
        /// </summary>
        private const int DefaultCount = 10;

        /// <summary>
        /// The default max. number of days to query.
        /// </summary>
        private const int DefaultDays = 7;

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
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many items to return at most.</param>
        /// <param name="published">Whether to return only published items.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of site items</returns>
        public IQueryable<SiteItem> GetItems(int days, int count, bool published, params string[] tags)
        {
            // Select max number of items, or items within specified number of days, whichever returns more.
            DateTime oldest = DateTime.Now - TimeSpan.FromDays(days);

            return this.context.SiteItems
                .Where(byCount =>
                       byCount.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byCount.Published)
                .OrderByDescending(order => order.Date)
                .Take(count)
                .Union(this.context.SiteItems
                .Where(byDate =>
                       byDate.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byDate.Date <= oldest &&
                       byDate.Published))
                .OrderByDescending(order => order.Date)
                .Take(count);
        }

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many items to return at most.</param>
        /// <param name="author">The author name.</param>
        /// <param name="published">Whether to return only published items.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of site items</returns>
        public IQueryable<SiteItem> GetItems(int days, int count, string author, bool published, params string[] tags)
        {
            // Select max number of items, or items within specified number of days, whichever returns more.
            DateTime oldest = DateTime.Now - TimeSpan.FromDays(days);

            return this.context.SiteItems
                .Where(byCount =>
                       byCount.Author.Name == author &&
                       byCount.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byCount.Published)
                .OrderByDescending(order => order.Date)
                .Take(count)
                .Union(this.context.SiteItems
                .Where(byDate =>
                       byDate.Author.Name == author &&
                       byDate.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byDate.Date <= oldest &&
                       byDate.Published))
                .OrderByDescending(order => order.Date)
                .Take(count);
        }

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many items to return at most.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of site items</returns>
        public IQueryable<SiteItem> GetItems(int days, int count, string search, params string[] tags)
        {
            DateTime oldest = DateTime.Now - TimeSpan.FromDays(days);
            string searchLower = search.ToLower();

            return this.context.SiteItems
                .Where(byCount =>
                    (
                        byCount.Title.ToLower().Contains(searchLower) ||
                        searchLower.Contains(byCount.Title.ToLower()) ||
                        byCount.Content.ToLower().Contains(searchLower)
                    ) &&
                    byCount.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    byCount.Published)
                .OrderByDescending(order => order.Date)
                .Take(count)
                .Union(this.context.SiteItems
                .Where(byDate =>
                    (
                        byDate.Title.ToLower().Contains(searchLower) ||
                        searchLower.Contains(byDate.Title.ToLower()) ||
                        byDate.Content.ToLower().Contains(searchLower)
                    ) &&
                    byDate.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    byDate.Date <= oldest &&
                    byDate.Published))
                .OrderByDescending(order => order.Date)
                .Take(count);
        }

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many items to return at most.</param>
        /// <param name="author">The author to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of site items</returns>
        public IQueryable<SiteItem> GetItems(int days, int count, string author, string search, params string[] tags)
        {
            DateTime oldest = DateTime.Now - TimeSpan.FromDays(days);
            string searchLower = search.ToLower();

            return this.context.SiteItems
                .Where(byCount =>
                    (
                        byCount.Title.ToLower().Contains(searchLower) ||
                        searchLower.Contains(byCount.Title.ToLower()) ||
                        byCount.Content.ToLower().Contains(searchLower)
                    ) &&
                    byCount.Author.Name == author &&
                    byCount.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    byCount.Published)
                .OrderByDescending(order => order.Date)
                .Take(count)
                .Union(this.context.SiteItems
                .Where(byDate =>
                    (
                        byDate.Title.ToLower().Contains(searchLower) ||
                        searchLower.Contains(byDate.Title.ToLower()) ||
                        byDate.Content.ToLower().Contains(searchLower)
                    ) &&
                    byDate.Author.Name == author &&
                    byDate.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    byDate.Date <= oldest &&
                    byDate.Published))
                .OrderByDescending(order => order.Date)
                .Take(count);
        }

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="typeTag">The built-in tag to search for.</param>
        /// <returns>A list of site items</returns>
        public IQueryable<SiteItem> GetItems(Tags typeTag)
        {
            return this.GetItems(DefaultDays, DefaultCount, true, typeTag.ToString().ToLower());
        }

        /// <summary>
        /// Gets the site items.
        /// </summary>
        /// <param name="typeTag">The built-in tag to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <returns>A list of site items</returns>
        public IQueryable<SiteItem> GetItems(Tags typeTag, string search)
        {
            return this.GetItems(DefaultDays, DefaultCount, search, typeTag.ToString().ToLower());
        }

        /// <summary>
        /// Gets the tags.
        /// </summary>
        /// <returns>A list of tags</returns>
        public IQueryable<Tag> GetTags()
        {
            return this.context.Tags;
        }

        /// <summary>
        /// Gets a site item.
        /// </summary>
        /// <param name="id">The site item Id.</param>
        /// <returns>The site item requested or null if not found.</returns>
        public SiteItem GetItem(int id)
        {
            var result = this.context.SiteItems.Where(item => item.Id == id).FirstOrDefault();

            if (result != null)
            {
                if (result.Comments == null)
                {
                    result.Comments = new List<Comment>();
                }

                if (result.Stars == null)
                {
                    result.Stars = new List<Star>();
                }
            }

            return result;
        }

        /// <summary>
        /// Gets the site item comments.
        /// </summary>
        /// <param name="id">The site item Id.</param>
        /// <returns>The comments for the site item.</returns>
        public IQueryable<Comment[]> GetItemComments(int id)
        {
            return this.context.SiteItems.Where(item => item.Id == id)
                                         .Select(result => result.Comments.ToArray());
        }

        /// <summary>
        /// Gets the site item stars.
        /// </summary>
        /// <param name="id">The site item Id.</param>
        /// <returns>The stars for the site item.</returns>
        public IQueryable<Star> GetItemStars(int id)
        {
            return this.context.Stars.Where(star => star.Item.Id == id);
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