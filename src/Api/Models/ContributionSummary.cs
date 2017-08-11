/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the model for article contribution summary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Models
{
    using System.Collections.Generic;

    /// <summary>
    /// Article contribution summary.
    /// </summary>
    public class ContributionSummary
    {
        /// <summary>
        /// Gets or sets the months to display for each page.
        /// </summary>
        public IList<PageSummary> Pages { get; set; }

        /// <summary>
        /// Gets or sets the monthly contribution summary.
        /// </summary>
        public MonthDictionary Months { get; set; }

        /// <summary>
        /// Gets or sets years the contributions are available for.
        /// </summary>
        public IList<int> Years { get; set; }

        /// <summary>
        /// Gets or sets the year the contribution summary is filtered for.
        /// </summary>
        public int Year {get; set; }

        /// <summary>
        /// Gets or sets the max. article count for any month.
        /// </summary>
        public int Max { get; set; }
    }
}