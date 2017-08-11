/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Aggregates monthly contribution summary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Aggregators
{
    using System;
    using System.Collections.Generic;
    using ZeroWeb.Api.Models;

    /// <summary>
    /// Monthly contribution summary aggregator.
    /// </summary>
    public interface IMonthContributionAggregator
    {
        int Aggregate(MonthSummary summary, DateTime firstDayOfMonth, string key, string title, DateTime date, string tag);
        bool CanAggregate(MonthSummary summary, DateTime date);
    }

    /// <summary>
    /// Monthly contribution summary aggregator.
    /// </summary>
    public class MonthContributionAggregator: IMonthContributionAggregator
    {
        /// <summary>
        /// The weekly summary aggregator.
        /// </summary>
        private IWeekContributionAggregator weekAggregator;

        /// <summary>
        /// Initializes a new instance of the <see cref="MonthContributionAggregator"/> class.
        /// </summary>
        public MonthContributionAggregator(IWeekContributionAggregator weekAggregator)
        {
            this.weekAggregator = weekAggregator;
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
        public int Aggregate(MonthSummary summary, DateTime firstDayOfMonth, string key, string title, DateTime date, string tag)
        {
            // Aggregate article count for the month.
            summary.Articles++;

            // Aggregate tag counts for the month.
            int tagCount = 0;
            summary.Tags.TryGetValue(tag, out tagCount);
            summary.Tags[tag] = tagCount + 1;

            // Aggregate tag summary for the week.
            DateTime firstDayOfWeek = Shared.GetStartOfWeek(date);
            int weekMax = this.weekAggregator.Aggregate(
                this.GetOrCreateWeek(summary, firstDayOfMonth, firstDayOfWeek),
                date,
                key,
                title,
                tag);

            // Aggregate max tags per week.
            if (summary.Max < weekMax)
            {
                summary.Max = weekMax;
            }
            
            return summary.Max;
        }

        /// <summary>
        /// Determines whether the specified date can be aggregated in this month's summary.
        /// </summary>
        /// <param name="date">The date to be aggregated.</param>
        /// <returns>Whether aggregating the date will not overflow the 4 weeks per month limit.</param>
        public bool CanAggregate(MonthSummary summary, DateTime date)
        {
            return summary.Weeks.ContainsKey(Shared.GetStartOfWeek(date)) || summary.Weeks.Count < 4;
        }

        /// <summary>
        /// Gets or creates a week entry.
        /// </summary>
        /// <param name="firstDayOfWeek">The date to create the week for.</param>
        /// <returns>The existing or new week summary.</param>
        private WeekSummary GetOrCreateWeek(MonthSummary summary, DateTime firstDayOfMonth, DateTime firstDayOfWeek)
        {
            if (summary.Weeks.ContainsKey(firstDayOfWeek))
            {
                return summary.Weeks[firstDayOfWeek];
            }

            return summary.Weeks[firstDayOfWeek] = new WeekSummary
            {
                Tags = new Dictionary<string, int>(),
                Days = new Dictionary<string, DaySummary>(),
                Articles = new List<string>(),
                UniqueArticles = new Dictionary<string, string>(),
                Offset = GetWeekOffset(firstDayOfMonth, firstDayOfWeek)
            };
        }

        /// <summary>
        /// Gets the week display offset.
        /// </summary>
        /// <param name="firstDayOfWeek">The first day of week.</param>
        /// <returns>The week display offset.</param>
        private static int GetWeekOffset(DateTime firstDayOfMonth, DateTime firstDayOfWeek)
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