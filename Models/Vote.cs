/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines site item stars.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Upvote or downvote a site item comment.
    /// </summary>
    [Table("Votes")]
    public class Vote
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Vote"/> class.
        /// </summary>
        public Vote()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Vote"/> class.
        /// </summary>
        /// <param name="target">The comment the vote is for.</param>
        /// <param name="author">The external identity voting for the comment.</param>
        /// <param name="up">Whether to upvote or downvote.</param>
        public Vote(Comment target, string author, bool up)
        {
            this.Comment = target;
            this.Author = author;
            this.Value = up ? 1 : -1;
        }

        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the vote value, 1 or -1.
        /// </summary>
        public int Value { get; set; }

        /// <summary>
        /// Gets or sets the site item this star is for.
        /// </summary>
        [Required]
        public Comment Comment { get; set; }

        /// <summary>
        /// Gets or sets the comment author identity.
        /// </summary>
        [Required]
        [MaxLength(64)]
        [Column(TypeName="char")]
        public string Author { get; set; }
    }
}