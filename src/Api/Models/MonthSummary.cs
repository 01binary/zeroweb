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
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// The monthly contribution summary.
    /// </summary>
    public class MonthSummary
    {
        /// <summary>
        /// Gets or sets the tag counts for each week (by first day of week).
        /// </summary>
        public IDictionary<DateTime, int> Tags { get; private set; }

        /// <summary>
        /// Gets or sets the week summaries (by first day of week).
        /// </summary>
        public IDictionary<DateTime, WeekSummary> Weeks { get; private set; }

        /// <summary>
        /// Gets or sets the tag count for the month.
        /// </summary>
        public int Total { get; private set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="MonthSummary"/> class.
        /// </summary>
        public MonthSummary()
        {
            this.Tags = new Dictionary<DateTime, int>();
            this.Weeks = new Dictionary<DateTime, WeekSummary>();
        }

        /// <summary>
        /// Aggregate tags for the week with an article context.
        /// </summary>
        /// <param name="articleId">The article unique Id.</param>
        /// <param name="articleTitle">The article title.</param>
        /// <param name="date">The article date.</param>
        /// <param name="tag">The article tag to aggregate.</param>
        /// <returns></returns>
        public int Aggregate(int articleId, string articleTitle, DateTime date, string tag)
        {
            // Aggregate tag counts for each week.
            int weekCount;
            DateTime weekStart = GetStartOfWeek(date);
            this.Tags.TryGetValue(weekStart, out weekCount);
            this.Tags[weekStart] = weekCount + 1;

            // Aggregate tag summary for the week.
            this.GetOrCreateWeek(weekStart).Aggregate(articleId, articleTitle, tag);

            // Aggregate tag totals.
            return ++this.Total;
        }

        /// <summary>
        /// Gets or creates a week entry.
        /// </summary>
        /// <param name="weekStart">The date to create the week for.</param>
        /// <returns>The existing or new week summary.</param>
        private WeekSummary GetOrCreateWeek(DateTime weekStart)
        {
            if (this.Weeks.ContainsKey(weekStart))
            {
                return this.Weeks[weekStart];
            }

            return this.Weeks[weekStart] = new WeekSummary();
        }

        /// <summary>
        /// Gets the start of the week the specified date occurs in.
        /// </summary>
        /// <param name="date">The date within a week.</param>
        /// <returns>The start of week.</returns>
        private static DateTime GetStartOfWeek(DateTime date)
        {
            if (date.DayOfWeek == DayOfWeek.Monday)
            {
                return date;
            }
            else if (date.DayOfWeek == DayOfWeek.Sunday)
            {
                return date.AddDays(-6);
            }
            else
            {
                return date.AddDays(-((int)date.DayOfWeek - 1));
            }
        }
    }
}