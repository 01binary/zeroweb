/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Enables assigning Tags to Tasks.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Task tag.
    /// </summary>
    [Table("TaskMetadata")]
    public class TaskMetadata
    {
        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Task to map to a Tag.
        /// </summary>
        [Required]
        public Task Task { get; set; }

        /// <summary>
        /// Gets or sets the Tag to map to a Task.
        /// </summary>
        [Required]
        public Tag Tag { get; set; }
    }
}