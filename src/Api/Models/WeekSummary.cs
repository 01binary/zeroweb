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
    using Newtonsoft.Json;

    /// <summary>
    /// The week contribution summary.
    /// </summary>
    public class WeekSummary
    {
        /// <summary>
        /// Gets or sets the count of tags aggregated for the week.
        /// </summary>
        public IDictionary<string, int> Tags { get; set; }

        /// <summary>
        /// Gets or sets the week day summaries.
        /// </summary>
        public IDictionary<string, DaySummary> Days { get; set; }

        /// <summary>
        /// Gets or sets the articles aggregated for the week by Id.
        /// </summary>
        public IList<string> Articles { get; set; }

        /// <summary>
        /// Gets or sets the unique article keys.
        /// </summary>
        [JsonIgnore]
        public IDictionary<string, string> UniqueArticles { get; set; }

        /// <summary>
        /// The display offset of this week within the month.
        /// </summary>
        public int Offset { get; set; }

        /// <summary>
        // Gets or sets the max tags for a week day.
        /// </summary>
        public int Max { get; set; }

        /// <summary>
        // Gets or sets the tag count for the week.
        /// </summary>
        [JsonIgnore]
        public int Total { get; set; }
    }
}