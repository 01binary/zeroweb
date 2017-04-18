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
    using System.Linq;

    /// <summary>
    /// Article contribution summary.
    /// </summary>
    public class ContributionSummary
    {
        /// <summary>
        /// Gets or sets the months to display for each page.
        /// </summary>
        public IList<PageSummary> Pages { get; private set; }

        /// <summary>
        /// Gets or sets the monthly contribution summary.
        /// </summary>
        public MonthDictionary Months { get; private set; }

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
            this.Months = new MonthDictionary();
        }

        /// <summary>
        /// Aggregate count for an article tag at all summary levels.
        /// </summary>
        /// <param name="articleKey">The unique article key used in permalinks.</param>
        /// <param name="articleTitle">The article title.</param>
        /// <param name="date">The date when an article with this tag was posted.</param>
        /// <param name="tag">The article tag.</param>
        /// <returns>A self-reference for chaining.</returns>
        public ContributionSummary Aggregate(string articleKey, string articleTitle, DateTime date, string tag)
        {
            MonthSummary monthSummary = this.GetOrCreateMonth(date);
            int monthTotal = monthSummary.Aggregate(articleKey, articleTitle, date, tag);

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
            DateTime? lastWeek = null;
            int lastWeekIndex = -1;
            string lastMonthName = null;
            int articleCount = 0;

            foreach (DateTime monthStart in this.Months.Keys.ToList().OrderByDescending(key => key))
            {
                string monthName = monthStart.ToString("MMM").ToLower();
                MonthSummary monthSummary = this.Months[monthStart];
                DateTime[] weeks = monthSummary.Weeks.Keys
                    .OrderByDescending(key => key)
                    .ToArray();

                for (int weekIndex = 0; weekIndex < weeks.Length; weekIndex++)
                {
                    DateTime weekStart = weeks[weekIndex];
                    WeekSummary weekSummary = monthSummary.Weeks[weekStart];
                    int dayCount = lastWeek.HasValue ? (int)(lastWeek.Value - weekStart).TotalDays : 0;

                    articleCount += weekSummary.Articles.Count;

                    if (articleCount > maxArticles || dayCount > maxDays)
                    {
                        PageSummary page = new PageSummary();
                        
                        page.Start = new WeekMapping(
                            lastMonthName == null ? monthName : lastMonthName,
                            lastWeekIndex == -1 ? weekIndex : lastWeekIndex);

                        page.End = new WeekMapping(monthName, weekIndex);

                        this.Pages.Add(page);

                        articleCount = 0;
                        lastWeek = weekStart;
                    }
                }

                lastMonthName = monthName;
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