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

    /// <summary>
    /// The monthly contribution summary.
    /// </summary>
    public class MonthSummary
    {
        /// <summary>
        /// Gets or sets the tag counts for each week (by first day of week).
        /// </summary>
        public WeekTotalsDictionary Tags { get; private set; }

        /// <summary>
        /// Gets or sets the week summaries (by first day of week).
        /// </summary>
        public WeekDictionary Weeks { get; private set; }

        /// <summary>
        /// Gets or sets the max week tag count.
        /// </summary>
        public int Max { get; private set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="MonthSummary"/> class.
        /// </summary>
        public MonthSummary()
        {
            this.Tags = new WeekTotalsDictionary();
            this.Weeks = new WeekDictionary();
        }

        /// <summary>
        /// Aggregate tags for the week with an article context.
        /// </summary>
        /// <param name="articleKey">The article key used in permalinks.</param>
        /// <param name="articleTitle">The article title.</param>
        /// <param name="date">The article date.</param>
        /// <param name="tag">The article tag to aggregate.</param>
        /// <returns>The aggregated count for the specified tag.</returns>
        public int Aggregate(string articleKey, string articleTitle, DateTime date, string tag)
        {
            // Aggregate tag counts for each week.
            int weekCount;
            DateTime weekStart = Shared.GetStartOfWeek(date);
            this.Tags.TryGetValue(weekStart, out weekCount);
            this.Tags[weekStart] = weekCount + 1;

            // Aggregate tag summary for the week.
            int weekMax = this.GetOrCreateWeek(weekStart).Aggregate(articleKey, articleTitle, tag);

            // Aggregate max tags per week.
            if (this.Max < weekMax)
            {
                this.Max = weekMax;
            }
            
            return this.Max;
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
    }
}