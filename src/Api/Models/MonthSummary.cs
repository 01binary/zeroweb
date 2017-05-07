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
        /// The max week tag count.
        /// </summary>
        private int max;

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
        /// Initializes a new instance of the <see cref="MonthSummary"/> class.
        /// </summary>
        public MonthSummary()
        {
            this.Tags = new Dictionary<string, int>();
            this.Weeks = new WeekDictionary();
        }

        /// <summary>
        /// Aggregate tags for the week with an article context.
        /// </summary>
        /// <param name="firstDayOfMonth">The first day of actual month were the article is to be aggregated.</param>
        /// <param name="key">The article key used in permalinks.</param>
        /// <param name="title">The article title.</param>
        /// <param name="date">The article date.</param>
        /// <param name="tag">The article tag to aggregate.</param>
        /// <returns>The aggregated count for the specified tag.</returns>
        public int Aggregate(DateTime firstDayOfMonth, string key, string title, DateTime date, string tag)
        {
            // Aggregate article count for the month.
            this.Articles++;

            // Aggregate tag counts for the month.
            int tagCount = 0;
            this.Tags.TryGetValue(tag, out tagCount);
            this.Tags[tag] = tagCount + 1;

            // Aggregate tag summary for the week.
            DateTime firstDayOfWeek = Shared.GetStartOfWeek(date);
            int weekMax = this.GetOrCreateWeek(firstDayOfMonth, firstDayOfWeek)
                .Aggregate(date, key, title, tag);

            // Aggregate max tags per week.
            if (this.max < weekMax)
            {
                this.max = weekMax;
            }
            
            return this.max;
        }

        /// <summary>
        /// Determines whether the specified date can be aggregated in this month's summary.
        /// </summary>
        /// <param name="date">The date to be aggregated.</param>
        /// <returns>Whether aggregating the date will not overflow the 4 weeks per month limit.</param>
        public bool CanAggregate(DateTime date)
        {
            return this.Weeks.ContainsKey(Shared.GetStartOfWeek(date)) || this.Weeks.Count < 4;
        }

        /// <summary>
        /// Gets or creates a week entry.
        /// </summary>
        /// <param name="firstDayOfWeek">The date to create the week for.</param>
        /// <returns>The existing or new week summary.</param>
        private WeekSummary GetOrCreateWeek(DateTime firstDayOfMonth, DateTime firstDayOfWeek)
        {
            if (this.Weeks.ContainsKey(firstDayOfWeek))
            {
                return this.Weeks[firstDayOfWeek];
            }

            int weekOffset = this.GetWeekOffset(firstDayOfMonth, firstDayOfWeek);

            return this.Weeks[firstDayOfWeek] = new WeekSummary(weekOffset);
        }

        /// <summary>
        /// Gets the week display offset.
        /// </summary>
        /// <param name="firstDayOfWeek">The first day of week.</param>
        /// <returns>The week display offset.</param>
        private int GetWeekOffset(DateTime firstDayOfMonth, DateTime firstDayOfWeek)
        {
            DateTime firstWeekOfMonth = Shared.GetStartOfWeek(firstDayOfMonth);

            for (int weekOffset = 0; weekOffset < 4; weekOffset++)
            {
                DateTime firstDayOfWeekOffset = firstWeekOfMonth.AddDays(weekOffset * 6);

                if (firstDayOfWeek == firstDayOfWeekOffset)
                {
                    return weekOffset;
                }
                else if (firstDayOfWeek < firstDayOfWeekOffset)
                {
                    return weekOffset - 1;
                }
            }

            return 3;
        }
    }
}