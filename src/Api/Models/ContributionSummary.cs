/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the contribution summary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Models
{
    using System.Collections.Generic;
    
    /// <summary>
    /// Contribution summary.
    /// </summary>
    public class ContributionSummary
    {
        /// <summary>
        /// Gets or sets the max. article count for any month.
        /// </summary>
        public int Max { get; set; }

        /// <summary>
        /// Gets or sets the months to display for each page.
        /// </summary>
        public IList<PageSummary> Pages { get; set; }

        /// <summary>
        /// Gets or sets the monthly contribution summary.
        /// </summary>
        public IDictionary<string, MonthSummary> Months { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ContributionSummary"/> class.
        /// </summary>
        public ContributionSummary()
        {
            this.Pages = new List<PageSummary>();
            this.Months = new Dictionary<string, MonthSummary>();
        }

        public void Aggregate(string month, int week, string weekName, string tag)
        {
            MonthSummary monthSummary = this.GetOrCreateMonth(month);
            monthSummary.Aggregate(weekName, tag);

            // TODO: aggregate pages?
        }

        /// <summary>
        /// Gets or creates a month entry.
        /// </summary>
        /// <param name="month">The month name in "mmm" format.</param>
        /// <returns>The existing or new month summary.</param>
        private MonthSummary GetOrCreateMonth(string month)
        {
            if (this.Months.ContainsKey(month))
            {
                return this.Months[month];
            }

            return this.Months[month] = new MonthSummary();
        }
    }
}