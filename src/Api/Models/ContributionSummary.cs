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
            int monthWeekMax = monthSummary.Aggregate(articleKey, articleTitle, date, tag);

            if (this.Max < monthWeekMax)
            {
                this.Max = monthWeekMax;
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
            DateTime? startWeek = null;
            string startMonthName = null;
            int startWeekIndex = -1;
            int articleCount = 0;

            // TODO: need empty weeks for pages to work properly.

            foreach (DateTime monthStart in this.Months.Keys.ToList().OrderByDescending(key => key))
            {
                string monthName = monthStart.ToString("MMM").ToLower();
                MonthSummary monthSummary = this.Months[monthStart];
                DateTime[] weeks = monthSummary.Weeks.Keys
                    .OrderBy(key => key)
                    .ToArray();

                for (int weekIndex = weeks.Length - 1; weekIndex >= 0; weekIndex--)
                {
                    DateTime weekStart = weeks[weekIndex];
                    WeekSummary weekSummary = monthSummary.Weeks[weekStart];
                    int dayCount = startWeek.HasValue ? (int)(startWeek.Value - weekStart).TotalDays : 0;

                    if (!startWeek.HasValue)
                    {
                        startWeek = weekStart;
                        startWeekIndex = weekIndex;
                    }

                    if (string.IsNullOrEmpty(startMonthName))
                    {
                        startMonthName = monthName;
                    }

                    articleCount += weekSummary.Articles.Count;

                    if (articleCount > maxArticles/* || dayCount > maxDays*/)
                    {
                        PageSummary page = new PageSummary();
                        page.Start = new WeekMapping(startMonthName, startWeekIndex);
                        page.End = new WeekMapping(monthName, weekIndex);
                        this.Pages.Add(page);

                        System.Diagnostics.Debug.WriteLine("reached article count " + maxArticles + " while on week " + weekIndex + " and month " + monthName + " with last week " + startWeekIndex + " and last month " + startMonthName);

                        articleCount = 0;
                        startWeekIndex = -1;
                        startWeek = null;
                        startMonthName = null;
                    }
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

            if (this.Months.Count > 0)
            {
                // Create entries for weeks between the max week and the current week.
                var maxMonthStart = this.Months.Keys.Max();
                
                for (DateTime fillMonth = firstOfMonth;
                    fillMonth < maxMonthStart;
                    fillMonth = fillMonth.AddDays(7))
                {
                    this.Months[fillMonth] = new MonthSummary();
                }
            }

            return this.Months[firstOfMonth] = new MonthSummary();
        }
    }
}