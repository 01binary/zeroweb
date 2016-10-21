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

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Star a site item.
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
        /// <param name="item">The item the star is for.</param>
        /// <param name="ip">The external identity starring the site item.</param>
        public Star(SiteItem item, string ip)
        {
            this.Item = item;
            this.IpAddress = ip;
        }

        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the site item this star is for.
        /// </summary>
        [Required]
        public SiteItem Item { get; set; }

        /// <summary>
        /// Gets or sets the comment author identity.
        /// </summary>
        [Required]
        [MaxLength(16)]
        [Column(TypeName="char")]
        public string IpAddress { get; set; }
    }
}