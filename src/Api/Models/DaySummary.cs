/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the day contribution summary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Models
{
    using System.Collections.Generic;

    /// <summary>
    /// The week contribution summary.
    /// </summary>
    public class DaySummary
    {
        /// <summary>
        /// Gets or sets the number of articles posted on this day.
        /// </summary>
        public int Count { get; set; }

        /// <summary>
        /// Gets or sets the tags posted on this day.
        /// </summary>
        public IList<string> Tags { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="DaySummary"/> class.
        /// </summary>
        public DaySummary()
        {
            this.Tags = new List<string>();
        }
    }
}