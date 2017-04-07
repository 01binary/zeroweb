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
    using System;
    using System.Collections.Generic;
    using Newtonsoft.Json;

    /// <summary>
    /// Article contribution summary.
    /// </summary>
    [JsonConverter(typeof(MonthKeyConverter), typeof(WeekKeyConverter))]
    public class ContributionSummary
    {
        /// <summary>
        /// Gets or sets the months to display for each page.
        /// </summary>
        public IList<PageSummary> Pages { get; private set; }

        /// <summary>
        /// Gets or sets the monthly contribution summary.
        /// </summary>
        public IDictionary<DateTime, MonthSummary> Months { get; private set; }

        /// <summary>
        /// Gets or sets the max. article count for any month.
        /// </summary>
        public int Max { get; private set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ContributionSummary"/> class.
        /// </summary>
        public ContributionSummary()
        {
            this.Pages = new List<PageSummary>();
            this.Months = new Dictionary<DateTime, MonthSummary>();
        }

        /// <summary>
        /// Aggregate count for an article tag at all summary levels.
        /// </summary>
        /// <param name="articleId">The article database Id.</param>
        /// <param name="articleTitle">The article title.</param>
        /// <param name="date">The date when an article with this tag was posted.</param>
        /// <param name="tag">The article tag.</param>
        /// <returns>A self-reference for chaining.</returns>
        public ContributionSummary Aggregate(int articleId, string articleTitle, DateTime date, string tag)
        {
            MonthSummary monthSummary = this.GetOrCreateMonth(date);
            int monthTotal = monthSummary.Aggregate(articleId, articleTitle, date, tag);

            if (this.Max < monthTotal)
            {
                this.Max = monthTotal;
            }

            return this;
        }

        /// <summary>
        /// Paginate the contribution summary.
        /// </summary>
        /// <param name="maxArticles">Max. articles per page.</param>
        /// <param name="maxDays">Max. days per page.</param>
        /// <returns>A self-reference for chaining.</returns>
        public ContributionSummary Paginate(int maxArticles, int maxDays)
        {
            List<PageSummary> updatedPages = new List<PageSummary>();

            // For each month from current to past
                // how do we know the order? They are flattened to strings
                // we are storing this wrong. Dictionaries are non-deterministic.
                // need a better way to store.
            // For each week
            // Break the page.

            int articleCount = 0;
            int dayCount = 0;

            foreach (DateTime month in this.Months.Keys)
            {
                foreach (DateTime week in this.Months[month].Weeks.Keys)
                {
                    WeekSummary weekSummary = this.Months[month].Weeks[week];

                    //weekSummary.
                }
            }

            return this;
        }

        /// <summary>
        /// Gets or creates a month entry.
        /// </summary>
        /// <param name="date">The date to create the month for.</param>
        /// <returns>The existing or new month summary.</param>
        private MonthSummary GetOrCreateMonth(DateTime date)
        {
            DateTime firstOfMonth = new DateTime(date.Year, date.Month, 1);

            if (this.Months.ContainsKey(firstOfMonth))
            {
                return this.Months[firstOfMonth];
            }

            return this.Months[firstOfMonth] = new MonthSummary();
        }
    }
}