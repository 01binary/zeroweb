/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines an article comment.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Comment on a site item.
    /// </summary>
    [Table("Comments")]
    public class Comment
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Comment"/> class.
        /// </summary>
        public Comment()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Comment"/> class.
        /// </summary>
        /// <param name="article">The article the comment is for.</param>
        /// <param name="author">The external identity creating the comment.</param>
        /// <param name="content">The comment content.</param>
        public Comment(Article article, string author, string content)
        {
            this.Article = article;
            this.Date = DateTime.Now;
            this.Author = author;
            this.Published = false;
            this.Content = content;
            this.Votes = new List<Vote>();
        }

        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the article this comment is for.
        /// </summary>
        [Required]
        public Article Article { get; set; }

        /// <summary>
        /// Gets or sets the publish date.
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether or not the comment is visible.
        /// </summary>
        public bool Published { get; set; }

        /// <summary>
        /// Gets or sets the comment votes.
        /// </summary>
        public ICollection<Vote> Votes { get; set; }

        /// <summary>
        /// Gets or sets the comment author identity.
        /// </summary>
        [Required]
        [MaxLength(64)]
        [Column(TypeName="char")]
        public string Author { get; set; }

        /// <summary>
        /// Gets or sets the comment content.
        /// </summary>
        [Required]
        [MaxLength(256)]
        public string Content { get; set; }
    }
}