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
        /// <param name="key">The unique article key used in permalinks.</param>
        /// <param name="title">The article title.</param>
        /// <param name="date">The date when an article with this tag was posted.</param>
        /// <param name="tag">The article tag.</param>
        /// <returns>A self-reference for chaining.</returns>
        public ContributionSummary Aggregate(string key, string title, DateTime date, string tag)
        {
            DateTime firstDayOfMonth = this.GetOrCreateMonth(date);
            MonthSummary monthSummary = this.Months[firstDayOfMonth];
            int monthWeekMax = monthSummary.Aggregate(firstDayOfMonth, key, title, date, tag);

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
        /// <returns>A self-reference for chaining.</returns>
        public ContributionSummary Paginate(int maxArticles)
        {
            string monthName = null;
            int articleCount = 0;
            DateTime[] weeks = null;
            WeekMapping pageStart = null;

            foreach (DateTime month in this.Months.Keys.ToList().OrderByDescending(key => key))
            {
                MonthSummary monthSummary = this.Months[month];
                monthName = month.ToString("MMM").ToLower();
                weeks = monthSummary.Weeks.Keys.OrderByDescending(key => key).ToArray();

                for (int weekIndex = 0; weekIndex < weeks.Length; weekIndex++)
                {
                    DateTime firstDayOfWeek = weeks[weekIndex];
                    WeekSummary weekSummary = monthSummary.Weeks[firstDayOfWeek];

                    for (int article = 0; article < weekSummary.Articles.Count; article++)
                    {
                        if (pageStart == null)
                        {
                            pageStart = new WeekMapping(monthName, weekIndex);
                        }

                        articleCount++;

                        if (articleCount == maxArticles)
                        {
                            this.Pages.Add(new PageSummary(
                                pageStart,
                                new WeekMapping(monthName, weekIndex)));

                            articleCount = 0;
                            pageStart = null;
                        }
                    }
                }
            }

            if (pageStart != null)
            {
                this.Pages.Add(new PageSummary(
                    pageStart,
                    new WeekMapping(monthName, weeks.Length - 1)));
            }

            return this;
        }

        /// <summary>
        /// Gets or creates a month entry.
        /// </summary>
        /// <param name="date">The date to create the month for.</param>
        /// <returns>The existing or new month summary.</param>
        private DateTime GetOrCreateMonth(DateTime date)
        {
            DateTime firstOfMonth = new DateTime(date.Year, date.Month, 1);

            if (this.Months.ContainsKey(firstOfMonth))
            {
                MonthSummary monthSummary = this.Months[firstOfMonth];

                if (monthSummary.CanAggregate(firstOfMonth))
                {
                    // Use the month of the entry.
                    return firstOfMonth;
                }
                else
                {
                    DateTime nextMonth = firstOfMonth.AddMonths(1);
                    DateTime firstDayOfWeek = Shared.GetStartOfWeek(date);

                    if (nextMonth.Month - firstDayOfWeek.Month > 1)
                    {
                        // Move most recent entry from the current month into next month.
                        DateTime maxWeek = monthSummary.Weeks.Keys.OrderByDescending(w => w).First();

                        if (this.Months[nextMonth].Weeks.ContainsKey(maxWeek))
                        {
                            // Last month already has this week, merge both summaries together.
                            this.Months[nextMonth].Weeks[maxWeek]
                                .Merge(monthSummary.Weeks[maxWeek]);
                        }
                        else
                        {
                            // Last month has no entry for this week, add it.
                            this.Months[nextMonth].Weeks
                                .Add(maxWeek, monthSummary.Weeks[maxWeek]);
                        }

                        // Use the month of the entry after moving an older entry out.
                        monthSummary.Weeks.Remove(maxWeek);
                        return firstOfMonth;
                    }
                    else
                    {
                        // Move this entry into next month.
                        return nextMonth;
                    }
                }
            }

            // Aggregate in a new month.
            this.Months[firstOfMonth] = new MonthSummary();
            return firstOfMonth;
        }
    }
}