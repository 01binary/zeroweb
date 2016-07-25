/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a tag taxonomy model.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Metadata tag.
    /// </summary>
    [Table("Tags")]
    public class Tag
    {
        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the tag name.
        /// </summary>
        [Required]
        [MaxLength(16)]
        [Column(TypeName = "char")]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the tag name.
        /// </summary>
        [MaxLength(128)]
        [Column(TypeName = "char")]
        public string Description { get; set; }
    }
}