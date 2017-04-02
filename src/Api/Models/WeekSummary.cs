/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the week contribution summary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Models
{
    using System.Collections.Generic;

    /// <summary>
    /// The week contribution summary.
    /// </summary>
    public class WeekSummary
    {
        /// <summary>
        /// Gets or sets the tags aggregated for the week.
        /// </summary>
        public IDictionary<string, int> Tags { get; set; }

        /// <summary>
        /// Gets or sets the total tags for the week.
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="WeekSummary"/> class.
        /// </summary>
        public WeekSummary()
        {
            this.Tags = new Dictionary<string, int>();
        }

        /// <summary>
        /// Aggregate the tag for this week.
        /// </summary>
        public void Aggregate(string tag)
        {
            if (this.Tags.ContainsKey(tag))
            {
                this.Tags[tag] = this.Tags[tag] + 1;
            }
            else
            {
                this.Tags[tag] = 1;
            }

            this.Total++;
        }
    }
}