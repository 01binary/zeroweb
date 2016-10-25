/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Assigns Tags (representing resources or taxonomy) to Issues.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Issue assignment.
    /// </summary>
    [Table("Assignments")]
    public class Assignment
    {
        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Issue to assign to a Tag.
        /// </summary>
        [Required]
        public Issue Issue { get; set; }

        /// <summary>
        /// Gets or sets the Tag to assign to an Issue.
        /// </summary>
        [Required]
        public Tag Tag { get; set; }
    }
}