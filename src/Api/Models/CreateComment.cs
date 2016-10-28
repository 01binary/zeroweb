/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the create comment request.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Models
{
    /// <summary>
    /// Create comment request.
    /// </summary>
    public class CreateComment
    {
        /// <summary>
        /// Gets or sets the article id for which to create a new comment.
        /// </summary>
        public int ArticleId { get; set; }

        /// <summary>
        /// Gets or sets the new comment content.
        /// </summary>
        public string Content { get; set; }
    }
}