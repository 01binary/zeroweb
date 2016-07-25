/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a site item task.
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
    /// Site item task.
    /// </summary>
    [Table("Tasks")]
    public class Task
    {
        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the site item this task belongs to.
        /// </summary>
        [Required]
        public SiteItem Item { get; set; }

        /// <summary>
        /// Gets or sets the parent task.
        /// </summary>
        /// <remarks>Marked virtual to prevent unnecessary join queries.</remarks>
        [ForeignKey("ParentId")]
        public virtual Task Parent { get; set; }

        /// <summary>
        /// Gets or sets the parent task Id.
        /// </summary>
        public int? ParentId { get; set; }

        /// <summary>
        /// Gets or sets a single task this task depends on.
        /// </summary>
        [ForeignKey("DependencyId")]
        public Task Dependency { get; set; }

        /// <summary>
        /// Gets or sets the dependency task Id.
        /// </summary>
        public int? DependencyId { get; set; }

        /// <summary>
        /// Gets or sets the task metadata.
        /// </summary>
        public ICollection<TaskMetadata> Metadata { get; set; }

        /// <summary>
        /// Gets or sets the task assignments.
        /// </summary>
        public ICollection<TaskAssignment> Assignments { get; set; }

        /// <summary>
        /// Gets or sets the task title.
        /// </summary>
        [Required]
        [MaxLength(32)]
        [Column(TypeName = "char")]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the task complexity as a Fibonacci number.
        /// </summary>
        [Column(TypeName = "tinyint")]
        public byte Complexity { get; set; }

        /// <summary>
        /// Gets or sets the start date if the task has a fixed start date.
        /// </summary>
        public DateTime? Start { get; set; }

        /// <summary>
        /// Gets or sets the end date if the task has a fixed end date.
        /// </summary>
        public DateTime? End { get; set; }

        /// <summary>
        /// Gets or sets the duration if the task start and end dates are determined by other tasks.
        /// </summary>
        public TimeSpan? Duration { get; set; }

        /// <summary>
        /// Gets or sets the baseline start date to track scope growth.
        /// </summary>
        public DateTime? BaselineStart { get; set; }

        /// <summary>
        /// Gets or sets the baseline end date to track scope growth.
        /// </summary>
        public DateTime? BaselineEnd { get; set; }

        /// <summary>
        /// Gets or sets the baseline duration to track scope growth.
        /// </summary>
        public TimeSpan? BaselineDuration { get; set; }
    }
}