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
        /// Gets the articles with the specified tags without ordering or pagination.
        /// </summary>
        /// <param name="published">Whether to return published or un-published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(bool published, params string[] tags);

        /// <summary>
        /// Gets the articles on the specified page, or on a page containing the specified article.
        /// </summary>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="page">The page number to return (ignored if null or an article is specified).</param>
        /// <param name="article">Return the page containing this article if non-null (id or key).</param>
        /// <param name="published">Whether to return published or un-published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(int count, int? page, int? year, string article, bool published, params string[] tags);

        /// <summary>
        /// Gets the articles with the specified author.
        /// </summary>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="author">The author to search for.</param>
        /// <param name="published">Whether to return published or un-published articles.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(int count, string author, bool published, params string[] tags);

        /// <summary>
        /// Gets the articles maching the specified search criteria.
        /// </summary>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(int count, string search, params string[] tags);

        /// <summary>
        /// Gets the articles for the specified author that match the specified search criteria.
        /// </summary>
        /// <param name="count">How many articles to return at most.</param>
        /// <param name="author">The author to search for.</param>
        /// <param name="search">Search titles and full text.</param>
        /// <param name="tags">The tags to search for.</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(int count, string author, string search, params string[] tags);

        /// <summary>
        /// Gets the articles with the specified tag on the specified page number or a page containing the specified article.
        /// </summary>
        /// <param name="tag">The built-in tag to search for.</param>
        /// <param name="page">Fetch the specified page unless articleId or year are specified.</param>
        /// <param name="year">Fetch the last page for the specified year.</param>
        /// <param name="article">Fetch the page containing the specified article if non-null (id or key).</param>
        /// <returns>A list of articles.</returns>
        IQueryable<Article> GetArticles(string tag, int? page, int? year, string article);

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
        /// Gets article comments.
        /// </summary>
        /// <param name="id">The article Ids.</param>
        /// <returns>The comments for the specified articles.</returns>
        IQueryable<Comment> GetArticleComments(int[] id);

        /// <summary>
        /// Gets the article stars.
        /// </summary>
        /// <param name="id">The article Id.</param>
        /// <returns>The stars for the article.</returns>
        IQueryable<Star> GetArticleStars(int id);

        /// <summary>
        /// Gets the article views.
        /// </summary>
        /// <param name="id">The article Ids.</param>
        /// <returns>The views for the article.</returns>
        IQueryable<View> GetArticleViews(int[] id);

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
        /// Adds a new article view.
        /// </summary>
        /// <param name="view">The view to add.</param>
        void Add(View view);

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