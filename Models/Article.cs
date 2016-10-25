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
    /// News story, article, project, or about page.
    /// </summary>
    [Table("Articles")]
    public class Article
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
        /// Gets or sets the number of views.
        /// </summary>
        public int Views { get; set; }

        /// <summary>
        /// Gets or sets the publish geographical location name where the article was authored.
        /// </summary>
        [MaxLength(32)]
        public string LocationName { get; set; }

        /// <summary>
        /// Gets or sets the location latitude.
        /// </summary>
        public double? LocationLatitude { get; set; }

        /// <summary>
        /// Gets or sets the location longitude.
        /// </summary>
        public double? LocationLongitude { get; set; }

        /// <summary>
        /// Gets or sets the location zoom.
        /// </summary>
        public double? LocationZoom { get; set;}

        /// <summary>
        /// Gets or sets the item metadata.
        /// </summary>
        public ICollection<Metadata> Metadata { get; set; }

        /// <summary>
        /// Gets or sets the item comments.
        /// </summary>
        public ICollection<Comment> Comments { get; set; }

        /// <summary>
        /// Gets or sets the item stars.
        /// </summary>
        public ICollection<Star> Stars { get; set; }

        /// <summary>
        /// Gets or sets the project issues if this article is a project.
        /// </summary>
        public ICollection<Issue> Issues { get; set; }

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