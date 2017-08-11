/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Aggregates the Contribution Summary model.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Aggregators
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using ZeroWeb.Api.Models;

    /// <summary>
    /// Contribution summary aggregator.
    /// </summary>
    public interface IContributionAggregator
    {
        ContributionSummary Aggregate(ContributionSummary summary, string key, string title, DateTime date, string tag);
    }

    /// <summary>
    /// Contribution summary aggregator.
    /// </summary>
    public class ContributionAggregator: IContributionAggregator
    {
        /// <summary>
        /// The monthly contribution aggregator.
        /// </summary>
        private IMonthContributionAggregator monthAggregator;

        /// <summary>
        /// The weekly contribution aggregator.
        /// </summary>
        private IWeekContributionAggregator weekAggregator;

        /// <summary>
        /// Initializes a new instance of the <see cref="ContributionAggregator"/> class.
        /// </summary>
        public ContributionAggregator(IMonthContributionAggregator monthAggregator, IWeekContributionAggregator weekAggregator)
        {
            this.monthAggregator = monthAggregator;
            this.weekAggregator = weekAggregator;
        }

        /// <summary>
        /// Aggregate count for an article tag at all summary levels.
        /// </summary>
        /// <param name="key">The unique article key used in permalinks.</param>
        /// <param name="title">The article title.</param>
        /// <param name="date">The date when an article with this tag was posted.</param>
        /// <param name="tag">The article tag.</param>
        /// <returns>A self-reference for chaining.</returns>
        public ContributionSummary Aggregate(ContributionSummary summary, string key, string title, DateTime date, string tag)
        {
            if (date.Year == summary.Year || (date.Year < summary.Year && summary.Months.Count < 12))
            {
                // Aggregate articles in previous years only to fill up extra month slots.
                DateTime firstDayOfMonth = this.GetOrCreateMonth(summary, date);
                MonthSummary monthSummary = summary.Months[firstDayOfMonth];
                int monthWeekMax = this.monthAggregator.Aggregate(monthSummary, firstDayOfMonth, key, title, date, tag);

                if (summary.Max < monthWeekMax)
                {
                    summary.Max = monthWeekMax;
                }
            }

            if (!summary.Years.Contains(date.Year))
            {
                summary.Years.Add(date.Year);
            }

            return summary;
        }

        /// <summary>
        /// Gets or creates a month entry.
        /// </summary>
        /// <param name="date">The date to create the month for.</param>
        /// <returns>The existing or new month summary.</param>
        private DateTime GetOrCreateMonth(ContributionSummary summary, DateTime date)
        {
            DateTime firstOfMonth = new DateTime(date.Year, date.Month, 1);

            if (summary.Months.ContainsKey(firstOfMonth))
            {
                MonthSummary monthSummary = summary.Months[firstOfMonth];

                if (this.monthAggregator.CanAggregate(monthSummary, firstOfMonth))
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

                        if (summary.Months[nextMonth].Weeks.ContainsKey(maxWeek))
                        {
                            // Last month already has this week, merge both summaries together.
                            this.weekAggregator.Merge(summary.Months[nextMonth].Weeks[maxWeek], monthSummary.Weeks[maxWeek]);
                        }
                        else
                        {
                            // Last month has no entry for this week, add it.
                            summary.Months[nextMonth].Weeks.Add(maxWeek, monthSummary.Weeks[maxWeek]);
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
            summary.Months[firstOfMonth] = new MonthSummary
            {
                Tags = new Dictionary<string, int>(),
                Weeks = new WeekDictionary()
            };

            return firstOfMonth;
        }
    }
}