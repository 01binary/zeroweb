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
        /// Gets the articles on the specified page, or on a page containing the specified article.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="page">The page number to return (ignored if 0 or an article is specified).</param>
        /// <param name="article">Return the page containing this article if non-null (by key or id).</param>
        /// <param name="published">Whether to return only published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(int days, int count, int page, string article, bool published, params string[] tags)
        {
            // Select max number of articles, or articles within specified number of days, whichever returns more.
            DateTime oldest = DateTime.Now - TimeSpan.FromDays(days);

            var firstPage = this.context.Articles
                .Where(byCount =>
                       byCount.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byCount.Published == published)
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count)
                .Union(this.context.Articles
                .Where(byDate =>
                       byDate.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byDate.Date.Ticks <= oldest.Ticks &&
                       byDate.Published == published))
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count);
            
            // Select items on the same page as the article if an article was specified.
            int articleId = this.GetArticleId(article, published);

            if (articleId > 0)
            {
                if (firstPage.Any(byId => byId.Id == articleId))
                {
                    return firstPage;
                }
                
                page = Math.Max(this.GetArticleIndex(articleId, published, tags) / count, 1);
            }
            
            // Select items on the given page.
            return this.context.Articles
                .Where(byPage =>
                       byPage.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byPage.Published == published)
                .OrderByDescending(order => order.Date.Ticks)
                .Skip(firstPage.Count() + (page - 1) * count)
                .Take(count);
        }

        /// <summary>
        /// Gets the articles with the specified author.
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
                       byCount.Published == published)
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count)
                .Union(this.context.Articles
                .Where(byDate =>
                       byDate.Author.Name == author &&
                       byDate.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       byDate.Date.Ticks <= oldest.Ticks &&
                       byDate.Published == published))
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count);
        }

        /// <summary>
        /// Gets the articles maching the specified search criteria.
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
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count)
                .Union(this.context.Articles
                .Where(byDate =>
                    (
                        byDate.Title.ToLower().Contains(searchLower) ||
                        searchLower.Contains(byDate.Title.ToLower()) ||
                        byDate.Content.ToLower().Contains(searchLower)
                    ) &&
                    byDate.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    byDate.Date.Ticks <= oldest.Ticks &&
                    byDate.Published))
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count);
        }

        /// <summary>
        /// Gets the articles for the specified author that match the specified search criteria.
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
                .OrderByDescending(order => order.Date.Ticks)
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
                    byDate.Date.Ticks <= oldest.Ticks &&
                    byDate.Published))
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count);
        }

        /// <summary>
        /// Gets the articles with the specified tag.
        /// </summary>
        /// <param name="tag">The built-in tag to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(string tag)
        {
            return this.GetArticles(Shared.DaysPerPage, Shared.ArticlesPerPage, 0, null, true, tag);
        }

        /// <summary>
        /// Gets the articles with the specified tag on the specified page number or a page containing the specified article.
        /// </summary>
        /// <param name="tag">The built-in tag to search for.</param>
        /// <param name="page">Fetch the specified page unless articleId is specified.</param>
        /// <param name="article">Fetch the page containing the specified article if non-null (id or key).</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(string tag, int page, string article)
        {
            return this.GetArticles(Shared.DaysPerPage, Shared.ArticlesPerPage, page, article, true, tag);
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

        /// <summary>
        /// Gets the article Id given an identification string.
        /// </summary>
        /// <param name="article">Article Key or Id.</param>
        /// <param name="published">Whether to look for published or unpublished articles.</param>
        /// <returns>The article Id.</returns>
        private int GetArticleId(string article, bool published)
        {
            int articleId = 0;

            if (!string.IsNullOrEmpty(article) && article.Length > 0)
            {
                if (!int.TryParse(article, out articleId))
                {
                   articleId = this.context.Articles
                        .Where(byKey =>
                            byKey.Key == article &&
                            byKey.Published == published)
                        .Select(result => result.Id)
                        .FirstOrDefault();
                }
            }

            return articleId;
        }

        /// <summary>
        /// Gets the index of article in the list.
        /// </summary>
        /// <param name="articleId">The Id of the article to get the index of.</param>
        /// <param name="published">Published status used to retrieve the article list.</param>
        /// <param name="tags">The tags used to retrieve the article list.</param>
        /// <returns>Index of the article or -1 if not found.</returns>
        private int GetArticleIndex(int articleId, bool published, params string[] tags)
        {
            var indexGroup = this.context.Articles
                .Where(all =>
                    all.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    all.Published == published)
                .OrderByDescending(order => order.Date.Ticks)
                .ToArray()
                .Select((item, index) => new {
                    Item = item,
                    Index = index
                })
                .Where(itemGroup => itemGroup.Item.Id == articleId)
                .FirstOrDefault();

            if (indexGroup != null)
            {
                return indexGroup.Index;
            }

            return -1;
        }
    }
}