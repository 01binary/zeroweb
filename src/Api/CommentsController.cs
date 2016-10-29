/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the Comments Endpoint.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ZeroWeb.Models;
using ZeroWeb.Api.Models;

namespace ZeroWeb.Api
{
    /// <summary>
    /// The Comments Endpoint.
    /// </summary>
    [Route("api/comments")]
    public class CommentsController: Controller
    {
        /// <summary>
        /// The site data store.
        /// </summary>
        IDataStore store;

        /// <summary>
        /// Initializes a new instance of the <see cref="CommentsController"/> class.
        /// </summary>
        /// <param name="store">The data store.</param>
        public CommentsController(IDataStore store)
        {
            this.store = store;
        }

        /// <summary>
        /// Gets the site item comments.
        /// </summary>
        /// <param name="id">The site item Id.</param>
        [HttpGet("{id}")]
        public IActionResult GetComments(int id)
        {
            return this.Json(this.store.GetArticleComments(id)
                .Where(comment => comment.Published == true)
                .Select(comment => new
                {
                    id = comment.Id,
                    formattedDate = Shared.FormatDate(comment.Date),
                    date = comment.Date,
                    author = comment.Author,
                    votes = comment.Votes.Sum(vote => vote.Value),
                    votesReadOnly = this.User == null ||
                        this.User.Identity == null ||
                        comment.Votes.Any(vote => vote.Author == this.User.Identity.Name),
                    content = comment.Content
                })
                .ToArray());
        }

        /// <summary>
        /// Creates a new site item comment.
        /// </summary>
        /// <param name="request">The request to create a new comment.</param>
        [HttpPost]
        public IActionResult CreateComment([FromBody]CreateComment request)
        {
            try
            {
                if (this.User.Identity.Name == null)
                {
                    return this.Unauthorized();
                }

                if (request.ArticleId == 0 || string.IsNullOrEmpty(request.Content))
                {
                    return this.BadRequest();
                }

                var article = this.store.GetArticle(request.ArticleId);
                var comment = new Comment(article, this.User.Identity.Name, request.Content);

                article.Comments.Add(comment);
                this.store.Save();

                return this.CreatedAtRoute(string.Empty, new
                {
                    id = comment.Id,
                    date = comment.Date,
                    formattedDate = Shared.FormatDate(comment.Date)
                });
            }
            catch
            {
                return this.BadRequest();
            }
        }

        /// <summary>
        /// Upvotes a site item comment.
        /// </summary>
        /// <param name="request">The comment to upvote.</param>
        [HttpPost("upvote/{id}")]
        public IActionResult UpvoteComment(int id)
        {
            try
            {
                if (this.User.Identity.Name == null)
                {
                    return this.Unauthorized();
                }

                var comment = this.store.GetComment(id);

                if (comment == null)
                {
                    return this.NotFound();
                }

                if (comment.Author.Name == this.User.Identity.Name)
                {
                    return this.BadRequest();
                }
                
                var commentVotes = this.store.GetCommentVotes(id);
                
                if (commentVotes.Any(vote => vote.Author == this.User.Identity.Name))
                {
                    return this.BadRequest();
                }
                
                comment.Votes.Add(new Vote(comment, this.User.Identity.Name, true));
                store.Save();
                
                return this.Ok(new { votes = commentVotes.Count() });
            }
            catch
            {
                return this.StatusCode(500);
            }
        }

        /// <summary>
        /// Downvotes a site item comment.
        /// </summary>
        /// <param name="request">The comment to downvote.</param>
        [HttpPost("downvote/{id}")]
        public IActionResult DownvoteComment(int id)
        {
            try
            {
                if (this.User.Identity.Name == null)
                {
                    return this.Unauthorized();
                }

                var comment = this.store.GetComment(id);

                if (comment == null)
                {
                    return this.NotFound();
                }

                if (comment.Author.Name == this.User.Identity.Name)
                {
                    return this.BadRequest();
                }
                
                var commentVotes = this.store.GetCommentVotes(id);
                
                if (commentVotes.Any(vote => vote.Author == this.User.Identity.Name))
                {
                    return this.BadRequest();
                }
                
                comment.Votes.Add(new Vote(comment, this.User.Identity.Name, false));
                store.Save();
                
                return this.Ok(new { votes = commentVotes.Sum(vote => vote.Value) });
            }
            catch
            {
                return this.StatusCode(500);
            }
        }

        /// <summary>
        /// Edits a site item comment.
        /// </summary>
        /// <param name="commentId">The Id of the comment to edit.</param>
        [HttpPut]
        public IActionResult EditComment(int commentId)
        {
            // TODO
            return this.NoContent();
        }

        /// <summary>
        /// Deletes a site item comment.
        /// </summary>
        /// <param name="commentId">The Id of the comment to delete.</param>
        [HttpDelete("{id}")]
        public IActionResult DeleteComment(int commentId)
        {
            // TODO
            return this.Ok();
        }
    }
}