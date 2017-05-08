/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines article views.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Unique article view.
    /// </summary>
    [Table("Views")]
    public class View
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="View"/> class.
        /// </summary>
        public View()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="View"/> class.
        /// </summary>
        /// <param name="view">The article the view is for.</param>
        /// <param name="ip">The external identity viewing the article.</param>
        public View(Article article, string ip)
        {
            this.Article = article;
            this.IpAddress = ip;
            this.Date = DateTime.Now;
        }

        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the article this view is for.
        /// </summary>
        [Required]
        public Article Article { get; set; }

        /// <summary>
        /// Gets or sets the external comment author identity.
        /// </summary>
        [Required]
        [MaxLength(16)]
        [Column(TypeName="char")]
        public string IpAddress { get; set; }

        /// <summary>
        /// Gets or sets the date of the view.
        /// </summary>
        [Required]
        public DateTime Date { get; set; }
    }
}