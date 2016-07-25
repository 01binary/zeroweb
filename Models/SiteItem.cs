/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a news story, article, or project.
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
    /// News story, article, or project.
    /// </summary>
    [Table("SiteItems")]
    public class SiteItem
    {
        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the publish date.
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether or not the item is visible.
        /// </summary>
        public bool Published { get; set; }

        /// <summary>
        /// Gets or sets the item metadata.
        /// </summary>
        public ICollection<SiteItemMetadata> Metadata { get; set; }

        /// <summary>
        /// Gets or sets the project tasks if this article is a project.
        /// </summary>
        public ICollection<Task> Tasks { get; set; }

        /// <summary>
        /// Gets or sets the author (tag).
        /// </summary>
        [Required]
        public Tag Author { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        [Required]
        [MaxLength(64)]
        [Column(TypeName="char")]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the thumbnail URI.
        /// </summary>
        [Required]
        [MaxLength(256)]
        [Column(TypeName="char")]
        public string Thumbnail { get; set; }

        /// <summary>
        /// Gets or sets the markdown content.
        /// </summary>
        [Required]
        [Column(TypeName="char")]
        public string Content { get; set; }
    }
}