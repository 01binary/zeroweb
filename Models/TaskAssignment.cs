/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Enables assigning Resources to Tasks.
|----------------------------------------------------------
|  Copyright(C) 2016 Valeriy Novytskyy
\*---------------------------------------------------------*/

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZeroWeb.Models
{
    /// <summary>
    /// Task assignment.
    /// </summary>
    [Table("TaskAssignments")]
    public class TaskAssignment
    {
        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Task to assign to a Resource (tag).
        /// </summary>
        [Required]
        public Task Task { get; set; }

        /// <summary>
        /// Gets or sets the Resource (tag) to assign to a Task.
        /// </summary>
        [Required]
        public Tag Assignment { get; set; }
    }
}