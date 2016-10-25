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
        /// Gets the articles.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="published">Whether to return only published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(int days, int count, bool published, params string[] tags);

        /// <summary>
        /// Gets the articles.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="author">The author to search for.</param>
        /// <param name="published">Whether to return only published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(int days, int count, string author, bool published, params string[] tags);

        /// <summary>
        /// Gets the articles.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(int days, int count, string search, params string[] tags);

        /// <summary>
        /// Gets the articles.
        /// </summary>
        /// <param name="days">How many days to return.</param>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="author">The author to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(int days, int count, string author, string search, params string[] tags);

        /// <summary>
        /// Gets the articles.
        /// </summary>
        /// <param name="typeTag">The built-in tag to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(Tags typeTag);

        /// <summary>
        /// Gets the articles.
        /// </summary>
        /// <param name="typeTag">The built-in tag to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(Tags typeTag, string search);

        /// <summary>
        /// Gets the tags.
        /// </summary>
        /// <returns>A list of tags.</returns>
        IQueryable<Tag> GetTags();

        /// <summary>
        /// Gets an article.
        /// </summary>
        /// <param name="id">The article Id.</param>
        /// <returns>The article requested or null if not found.</returns>
        Article GetArticle(int id);

        /// <summary>
        /// Gets an article comment.
        /// </summary>
        /// <param name="id">The comment Id.</param>
        /// <returns>The comment requested or null if not found.</returns>
        Comment GetComment(int id);

        /// <summary>
        /// Gets the article comments.
        /// </summary>
        /// <param name="id">The article Id.</param>
        /// <returns>The comments for the article.</returns>
        IQueryable<Comment> GetArticleComments(int id);

        /// <summary>
        /// Gets the article stars.
        /// </summary>
        /// <param name="id">The article Id.</param>
        /// <returns>The stars for the article.</returns>
        IQueryable<Star> GetArticleStars(int id);

        /// <summary>
        /// Gets the comment votes.
        /// </summary>
        /// <param name="id">The comment Id.</param>
        /// <returns>The votes for the comment.</returns>
        IQueryable<Vote> GetCommentVotes(int id);

        /// <summary>
        /// Adds a new article.
        /// </summary>
        /// <param name="article">The article to add.</param>
        void Add(Article article);

        /// <summary>
        /// Removes an article.
        /// </summary>
        /// <param name="article">The article to remove.</param>
        void Remove(Article article);

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