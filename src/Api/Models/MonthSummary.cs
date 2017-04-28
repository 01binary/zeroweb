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
        public int Aggregate(string articleKey, string articleTitle, DateTime firstDayOfMonth, DateTime date, string tag)
        {
            // Aggregate tag counts for each week.
            int weekCount;
            DateTime firstDayOfWeek = Shared.GetStartOfWeek(date);
            this.Tags.TryGetValue(firstDayOfWeek, out weekCount);
            this.Tags[firstDayOfWeek] = weekCount + 1;

            // Aggregate tag summary for the week.
            int weekMax = this.GetOrCreateWeek(firstDayOfMonth, firstDayOfWeek)
                .Aggregate(articleKey, articleTitle, tag);

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
            DateTime lastWeekOfMonth = firstWeekOfMonth.AddDays(18);
            
            System.Diagnostics.Debug.WriteLine("---- First week of month for week [" + firstDayOfWeek.ToString("MMM dd") + " - " + firstDayOfWeek.AddDays(6).ToString("MMM dd") + "] is [" + firstWeekOfMonth.ToString("MMM dd") + " - " + firstWeekOfMonth.AddDays(6).ToString("MMM dd") + "]");

            for (int weekOffset = 0; weekOffset < 4; weekOffset++)
            {
                DateTime firstDayOfWeekOffset = firstWeekOfMonth.AddDays(weekOffset * 6);

                if (firstDayOfWeek == firstDayOfWeekOffset)
                {
                    System.Diagnostics.Debug.WriteLine("Placing week [" + firstDayOfWeek.ToString("MMM dd") + " - " + firstDayOfWeek.AddDays(6).ToString("MMM dd") + "] at offset " + weekOffset + " because the start of that week is same as Week[" + weekOffset + "] = [" + firstDayOfWeekOffset.ToString("MMM dd") + " - " + firstDayOfWeekOffset.AddDays(6).ToString("MMM dd") + "]");
                    return weekOffset;
                }
                else if (firstDayOfWeek < firstDayOfWeekOffset)
                {
                    System.Diagnostics.Debug.WriteLine("Placing week [" + firstDayOfWeek.ToString("MMM dd") + " - " + firstDayOfWeek.AddDays(6).ToString("MMM dd") + "] at offset " + (weekOffset - 1) + " because the start of that week is before Week[" + weekOffset + "] = [" + firstDayOfWeekOffset.ToString("MMM dd") + " - " + firstDayOfWeekOffset.AddDays(6).ToString("MMM dd") + "]");
                    return weekOffset - 1;
                }
            }

            System.Diagnostics.Debug.WriteLine("Placing week [" + firstDayOfWeek.ToString("MMM dd") + " - " + firstDayOfWeek.AddDays(6).ToString("MMM dd") + "] at offset 3 because the start of that week is greater than Week[3] = [" + lastWeekOfMonth.ToString("MMM dd") + " - " + lastWeekOfMonth.AddDays(6).ToString("MMM dd") + "]");

            return 3;
        }
    }
}