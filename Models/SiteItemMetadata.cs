/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Enables assigning Tags to Site Items.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Article tags.
    /// </summary>
    [Table("SiteItemMetadata")]
    public class SiteItemMetadata
    {
        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Site Item to map to a Tag.
        /// </summary>
        [Required]
        public SiteItem Item { get; set; }

        /// <summary>
        /// Gets or sets the Tag to map to a Site Item.
        /// </summary>
        [Required]
        public Tag Tag { get; set; }
    }
}