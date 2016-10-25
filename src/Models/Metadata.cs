/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Enables assigning Tags to Articles.
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
    [Table("Metadata")]
    public class Metadata
    {
        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Article to map to a Tag.
        /// </summary>
        [Required]
        public Article Article { get; set; }

        /// <summary>
        /// Gets or sets the Tag to map to an Article.
        /// </summary>
        [Required]
        public Tag Tag { get; set; }
    }
}