/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines an article issue.
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
    /// Article issue.
    /// </summary>
    [Table("Issues")]
    public class Issue
    {
        /// <summary>
        /// Gets or sets the primary key.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the article this issue belongs to.
        /// </summary>
        [Required]
        public Article Article { get; set; }

        /// <summary>
        /// Gets or sets the parent issue.
        /// </summary>
        /// <remarks>Marked virtual to prevent unnecessary join queries.</remarks>
        [ForeignKey("ParentId")]
        public virtual Issue Parent { get; set; }

        /// <summary>
        /// Gets or sets the parent issue Id.
        /// </summary>
        public int? ParentId { get; set; }

        /// <summary>
        /// Gets or sets a single issue this issue depends on.
        /// </summary>
        [ForeignKey("DependencyId")]
        public Issue Dependency { get; set; }

        /// <summary>
        /// Gets or sets the dependency issue Id.
        /// </summary>
        public int? DependencyId { get; set; }

        /// <summary>
        /// Gets or sets the issue assignments.
        /// </summary>
        public ICollection<Assignment> Assignments { get; set; }

        /// <summary>
        /// Gets or sets the issue title.
        /// </summary>
        [Required]
        [MaxLength(32)]
        [Column(TypeName = "char")]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the issue complexity as a Fibonacci number.
        /// </summary>
        [Column(TypeName = "tinyint")]
        public byte Complexity { get; set; }

        /// <summary>
        /// Gets or sets the start date if the issue has a fixed start date.
        /// </summary>
        public DateTime? Start { get; set; }

        /// <summary>
        /// Gets or sets the end date if the issue has a fixed end date.
        /// </summary>
        public DateTime? End { get; set; }

        /// <summary>
        /// Gets or sets the duration if the issue start and end dates are determined by other issues.
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