/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a site item comment.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
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
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the site item this comment is for.
        /// </summary>
        [Required]
        public SiteItem Item { get; set; }

        /// <summary>
        /// Gets or sets the publish date.
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether or not the item is visible.
        /// </summary>
        public bool Published { get; set; }

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