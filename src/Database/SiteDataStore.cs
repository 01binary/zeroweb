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
        /// The default max. number of articles. to query.
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
        /// Gets the articles.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="published">Whether to return only published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(int days, int count, bool published, params string[] tags)
        {
            // Select max number of articles, or articles within specified number of days, whichever returns more.
            DateTime oldest = DateTime.Now - TimeSpan.FromDays(days);

            return this.context.Articles
                .Where(byCount =>
                       byCount.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byCount.Published)
                .OrderByDescending(order => order.Date)
                .Take(count)
                .Union(this.context.Articles
                .Where(byDate =>
                       byDate.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byDate.Date <= oldest &&
                       byDate.Published))
                .OrderByDescending(order => order.Date)
                .Take(count);
        }

        /// <summary>
        /// Gets the articles.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="author">The author name.</param>
        /// <param name="published">Whether to return only published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(int days, int count, string author, bool published, params string[] tags)
        {
            // Select max number of articles, or articles within specified number of days, whichever returns more.
            DateTime oldest = DateTime.Now - TimeSpan.FromDays(days);

            return this.context.Articles
                .Where(byCount =>
                       byCount.Author.Name == author &&
                       byCount.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byCount.Published)
                .OrderByDescending(order => order.Date)
                .Take(count)
                .Union(this.context.Articles
                .Where(byDate =>
                       byDate.Author.Name == author &&
                       byDate.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byDate.Date <= oldest &&
                       byDate.Published))
                .OrderByDescending(order => order.Date)
                .Take(count);
        }

        /// <summary>
        /// Gets the articles.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(int days, int count, string search, params string[] tags)
        {
            DateTime oldest = DateTime.Now - TimeSpan.FromDays(days);
            string searchLower = search.ToLower();

            return this.context.Articles
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
                .Union(this.context.Articles
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
        /// Gets the articles.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="author">The author to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(int days, int count, string author, string search, params string[] tags)
        {
            DateTime oldest = DateTime.Now - TimeSpan.FromDays(days);
            string searchLower = search.ToLower();

            return this.context.Articles
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
                .Union(this.context.Articles
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
        /// Gets the articles.
        /// </summary>
        /// <param name="typeTag">The built-in tag to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(Tags typeTag)
        {
            return this.GetArticles(DefaultDays, DefaultCount, true, typeTag.ToString().ToLower());
        }

        /// <summary>
        /// Gets the articles.
        /// </summary>
        /// <param name="typeTag">The built-in tag to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(Tags typeTag, string search)
        {
            return this.GetArticles(DefaultDays, DefaultCount, search, typeTag.ToString().ToLower());
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
        /// Gets an article.
        /// </summary>
        /// <param name="id">The article Id.</param>
        /// <returns>The article requested or null if not found.</returns>
        public Article GetArticle(int id)
        {
            var result = this.context.Articles
                .Where(item => item.Id == id)
                .FirstOrDefault();

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
        /// Gets an article comment.
        /// </summary>
        /// <param name="id">The comment Id.</param>
        /// <returns>The comment requested or null if not found.</returns>
        public Comment GetComment(int id)
        {
            var result = this.context.Comments
                .Where(comment => comment.Id == id)
                .FirstOrDefault();

            if (result != null)
            {
                if (result.Votes == null)
                {
                    result.Votes = new List<Vote>();
                }
            }

            return result;
        }

        /// <summary>
        /// Gets the article comments.
        /// </summary>
        /// <param name="id">The article Id.</param>
        /// <returns>The comments for the article.</returns>
        public IQueryable<Comment> GetArticleComments(int id)
        {
            return this.context.Comments
                .Where(comment => comment.Article.Id == id);
        }

        /// <summary>
        /// Gets the article stars.
        /// </summary>
        /// <param name="id">The article Id.</param>
        /// <returns>The stars for the article.</returns>
        public IQueryable<Star> GetArticleStars(int id)
        {
            return this.context.Stars.Where(star => star.Article.Id == id);
        }

        /// <summary>
        /// Gets the article comment votes.
        /// </summary>
        /// <param name="id">The article comment Id.</param>
        /// <returns>The votes for the article comment.</returns>
        public IQueryable<Vote> GetCommentVotes(int id)
        {
            return this.context.Votes.Where(vote => vote.Comment.Id == id);
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
        /// Adds a new article.
        /// </summary>
        /// <param name="item">The article to add.</param>
        public void Add(Article item)
        {
            this.context.Articles.Add(item);
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
        /// Removes an article.
        /// </summary>
        /// <param name="item">The article to remove.</param>
        public void Remove(Article item)
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