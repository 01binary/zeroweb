/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Comments API.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ZeroWeb.Models;

namespace ZeroWeb.API
{
    /// <summary>
    /// Comments API.
    /// </summary>
    [Route("services/comments")]
    public class CommentsService: Controller
    {
        /// <summary>
        /// The site data store.
        /// </summary>
        IDataStore store;

        /// <summary>
        /// Initializes a new instance of the <see cref="CommentsService"/> class.
        /// </summary>
        /// <param name="store">The data store.</param>
        public CommentsService(IDataStore store)
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
            return Json(this.store.GetItemComments(id)
                .First()
                .Where(comment => comment.Published == true)
                .OrderByDescending(comment => comment.Date)
                .Select(comment => new
                {
                    id = comment.Id,
                    date = Shared.FormatDate(comment.Date),
                    author = comment.Author,
                    content = comment.Content
                })
                .ToArray());
        }

        /// <summary>
        /// Creates a new site item comment.
        /// </summary>
        /// <param name="request">The comment to create.</param>
        [HttpPost]
        public IActionResult CreateComment([FromBody]dynamic request)
        {
            try
            {
                if (request.item == null || request.author == null || request.content == null)
                {
                    return this.BadRequest();
                }

                SiteItem item = this.store.GetItem((int)request.item.Value);
                Comment comment = new Comment(item, request.author.Value, request.content.Value);

                item.Comments.Add(comment);

                this.store.Save();

                return this.CreatedAtRoute(string.Empty, new
                {
                    id = comment.Id,
                    date = Shared.FormatDate(comment.Date)
                });
            }
            catch
            {
                return this.BadRequest();
            }
        }

        /// <summary>
        /// Edits a site item comment.
        /// </summary>
        /// <param name="commentId">The Id of the comment to edit.</param>
        [HttpPut]
        public IActionResult EditComment(int commentId)
        {
            return this.NoContent();
        }

        /// <summary>
        /// Edits a site item comment.
        /// </summary>
        /// <param name="commentId">The Id of the comment to edit.</param>
        [HttpDelete("{id}")]
        public IActionResult DeleteComment(int commentId)
        {
            return this.Ok();
        }
    }
}