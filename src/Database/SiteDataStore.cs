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
        /// Gets the articles with the specified tags without ordering or pagination.
        /// </summary>
        /// <param name="published">Whether to return published or un-published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(bool published, params string[] tags)
        {
            return this.context.Articles
                .Where(article =>
                    article.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    article.Published == published);
        }

        /// <summary>
        /// Gets the articles on the specified page, or on a page containing the specified article.
        /// </summary>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="page">The page number to return (ignored if null or an article or year is specified).</param>
        /// <param name="year">Determine the first page number by the year.</param>
        /// <param name="article">Return the page containing this article key.</param>
        /// <param name="published">Whether to return published or un-published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(int count, int? page, int? year, string article, bool published, params string[] tags)
        {
            var articles = this.context.Articles
                .Where(all =>
                       all.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       all.Published == published)
                .OrderByDescending(order => order.Date.Ticks);

            if (article != null)
            {
                // If an article sepcified, return the page with the article.
                page = 1 + this.GetArticleIndex(article, published, tags) / count;
            }
            else if (year != null)
            {
                // If a year is specified, return the page with last article of that year.
                page = 1 + this.GetYearIndex(year.Value, published, tags) / count;
            }
            else if (!page.HasValue)
            {
                // If no page specified, return the first page.
                page = 1;
            }
            
            return articles
                .Skip(Shared.ArticlesPerPage * (page.Value - 1))
                .Take(Shared.ArticlesPerPage);
        }

        /// <summary>
        /// Gets the articles with the specified author.
        /// </summary>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="author">The author name.</param>
        /// <param name="published">Whether to return published or un-published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(int count, string author, bool published, params string[] tags)
        {
            return this.context.Articles
                .Where(all =>
                       all.Author.Name == author &&
                       all.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                       all.Published == published)
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count);
        }

        /// <summary>
        /// Gets the articles maching the specified search criteria.
        /// </summary>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(int count, string search, params string[] tags)
        {
            string searchLower = search.ToLower();

            return this.context.Articles
                .Where(all =>
                    (
                        all.Title.ToLower().Contains(searchLower) ||
                        searchLower.Contains(all.Title.ToLower()) ||
                        all.Content.ToLower().Contains(searchLower)
                    ) &&
                    all.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    all.Published)
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count);
        }

        /// <summary>
        /// Gets the articles for the specified author that match the specified search criteria.
        /// </summary>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="author">The author to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(int count, string author, string search, params string[] tags)
        {
            string searchLower = search.ToLower();

            return this.context.Articles
                .Where(all =>
                    (
                        all.Title.ToLower().Contains(searchLower) ||
                        searchLower.Contains(all.Title.ToLower()) ||
                        all.Content.ToLower().Contains(searchLower)
                    ) &&
                    all.Author.Name == author &&
                    all.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    all.Published)
                .OrderByDescending(order => order.Date.Ticks)
                .Take(count);
        }

        /// <summary>
        /// Gets the articles with the specified tag on the specified page number or a page containing the specified article.
        /// </summary>
        /// <param name="tag">The built-in tag to search for.</param>
        /// <param name="page">Fetch the specified page unless articleId or year are specified.</param>
        /// <param name="year">Fetch the last page containing the specified year.</param>
        /// <param name="article">Fetch the page containing the specified article if non-null (id or key).</param>
        /// <returns>A list of articles.</returns>
        public IQueryable<Article> GetArticles(string tag, int? page, int? year, string article)
        {
            return this.GetArticles(Shared.ArticlesPerPage, page, year, article, true, tag);
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

                if (result.Views == null)
                {
                    result.Views = new List<View>();
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
        /// Gets article comments.
        /// </summary>
        /// <param name="id">The article Ids.</param>
        /// <returns>The comments for the articles.</returns>
        public IQueryable<Comment> GetArticleComments(int[] id)
        {
            return this.context.Comments
                .Where(comment => id.Contains(comment.Article.Id));
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
        /// Gets the article views.
        /// </summary>
        /// <param name="id">The article Ids.</param>
        /// <returns>The views for the article.</returns>
        public IQueryable<View> GetArticleViews(int[] id)
        {
            return this.context.Views.Where(view => id.Contains(view.Article.Id));
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
        /// Adds a new article view.
        /// </summary>
        /// <param name="view">The view to add.</param>
        public void Add(View view)
        {
            this.context.Views.Add(view);
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
        /// Gets the index of article in the list.
        /// </summary>
        /// <param name="article">The article key to get the index of.</param>
        /// <param name="published">Whether to return published or un-published articles.</param>
        /// <param name="tags">The tags used to retrieve the article list.</param>
        /// <returns>Index of the article or -1 if not found.</returns>
        private int GetArticleIndex(string article, bool published, params string[] tags)
        {
            var articleWithIndex = this.context.Articles
                .Where(all =>
                    all.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    all.Published == published)
                .OrderByDescending(order => order.Date.Ticks)
                .ToArray()
                .Select((item, index) => new {
                    Item = item,
                    Index = index
                })
                .Where(itemGroup => itemGroup.Item.Key == article)
                .FirstOrDefault();

            if (articleWithIndex != null)
            {
                return articleWithIndex.Index;
            }

            return -1;
        }

        /// <summary>
        /// Gets the page number of the last page containing the specified year.
        /// </summary>
        /// <param name="year">The year to find the last page for.</param>
        /// <param name="published">Whether to return published or un-published articles.</param>
        /// <param name="tags">The tags used to retrieve the article list.</param>
        /// <returns>The 1-based page index.</returns>
        private int GetYearIndex(int year, bool published, params string[] tags)
        {
            var articleWithIndex = this.context.Articles
                .Where(all =>
                    all.Metadata.Count(metadata => tags.Contains(metadata.Tag.Name)) > 0 &&
                    all.Published == published)
                .OrderByDescending(order => order.Date.Ticks)
                .ToArray()
                .Select((item, index) => new {
                    Item = item,
                    Index = index
                })
                .Where(itemGroup => itemGroup.Item.Date.Year == year)
                .FirstOrDefault();

            if (articleWithIndex != null)
            {
                return articleWithIndex.Index;
            }

            return -1;
        }
    }
}