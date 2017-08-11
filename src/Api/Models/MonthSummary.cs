/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the model for monthly contribution summary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Models
{
    using System.Collections.Generic;
    using Newtonsoft.Json;

    /// <summary>
    /// The monthly contribution summary.
    /// </summary>
    public class MonthSummary
    {
        /// <summary>
        /// Gets or sets the accumulated tag counts for the month.
        /// </summary>
        public IDictionary<string, int> Tags { get; set; }

        /// <summary>
        /// Gets or sets the week summaries (by first day of week).
        /// </summary>
        public WeekDictionary Weeks { get; set; }

        /// <summary>
        /// Gets or sets the number of articles published.
        /// </summary>
        public int Articles { get; set; }

        /// <summary>
        /// The max week tag count.
        /// </summary>
        [JsonIgnore]
        public int Max { get; set; }
    }
}