/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines article stars.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Star an article.
    /// </summary>
    [Table("Stars")]
    public class Star
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Star"/> class.
        /// </summary>
        public Star()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Star"/> class.
        /// </summary>
        /// <param name="article">The article the star is for.</param>
        /// <param name="ip">The external identity starring the article.</param>
        public Star(Article article, string ip)
        {
            this.Article = article;
            this.IpAddress = ip;
        }

        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the article this star is for.
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
    }
}