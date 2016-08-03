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

namespace ZeroWeb.API
{
    /// <summary>
    /// News API.
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
        public IActionResult GetComments(int id)
        {
            return Json(
                this.store
                .GetItem(id).Comments
                .Select(comment => new
                {
                    comment.Id,
                    comment.Author,
                    comment.Published,
                    comment.Content
                }).ToArray());
        }
    }
}