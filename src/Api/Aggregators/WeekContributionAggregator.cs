
/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Aggregates weekly contribution summary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Aggregators
{
    using System;
    using System.Collections.Generic;
    using ZeroWeb.Api.Models;

    /// <summary>
    /// Weekly contribution summary aggregator.
    /// </summary>
    public interface IWeekContributionAggregator
    {
        int Aggregate(WeekSummary summary, DateTime date, string key, string title, string tag);
        void Merge(WeekSummary target, WeekSummary merge);
    }

    /// <summary>
    /// Weekly contribution summary aggregator.
    /// </summary>
    public class WeekContributionAggregator: IWeekContributionAggregator
    {
        /// <summary>
        /// Aggregate tags for this week.
        /// </summary>
        /// <param name="date">The article date.</param>
        /// <param name="key">The unique article key used in permalinks.</param>
        /// <param name="title">The article title.</param>
        /// <param name="tag">The tag to aggregate.</param>
        /// <returns>The total tag count for the week.</param>
        public int Aggregate(WeekSummary summary, DateTime date, string key, string title, string tag)
        {
            if (!summary.UniqueArticles.ContainsKey(key))
            {
                summary.UniqueArticles.Add(key, title);
                summary.Articles.Add(title);

                this.AggregateTag(summary, tag, 1);
                this.AggregateDay(summary, date.ToString("ddd").ToLower(), new string[] { tag }, 1);
            }

            return summary.Total;
        }

        /// <summary>
        /// Merge with another week summary.
        /// </summary>
        /// <param name="merge">The week summary to merge with.</param>
        public void Merge(WeekSummary target, WeekSummary merge)
        {
            foreach (var article in merge.UniqueArticles)
            {
                target.UniqueArticles[article.Key] = article.Value;
                target.Articles.Add(article.Value);
            }

            foreach (var tag in merge.Tags)
            {
                this.AggregateTag(target, tag.Key, tag.Value);
            }

            foreach (var day in merge.Days)
            {
                this.AggregateDay(target, day.Key, day.Value.Tags, day.Value.Count);
            }
        }

        /// <summary>
        /// Aggregate count for the specified tag.
        /// </summary>
        /// <param name="merge">The week summary to merge with.</param>
        private void AggregateTag(WeekSummary summary, string tag, int count)
        {
            int tagCount;
            summary.Tags.TryGetValue(tag, out tagCount);
            summary.Tags[tag] = tagCount + count;
            summary.Total += count;
        }

        /// <summary>
        /// Aggregate count for the specified week day.
        /// </summary>
        /// <param name="weekDay">The week day to aggregate count for.</param>
        /// <param name="tags">The tags to aggregate for the day.</param>
        /// <param name="count">The number of articles to aggregate on that day.</param>
        private void AggregateDay(WeekSummary summary, string weekDay, IEnumerable<string> tags, int count)
        {
            DaySummary daySummary;

            if (!summary.Days.TryGetValue(weekDay, out daySummary))
            {
                daySummary = new DaySummary
                {
                    Tags = new List<string>()
                };
            }

            foreach (string tag in tags)
            {
                if (!daySummary.Tags.Contains(tag))
                {
                    daySummary.Tags.Add(tag);
                }
            }

            daySummary.Count += count;

            summary.Days[weekDay] = daySummary;

            if (daySummary.Count > summary.Max)
            {
                summary.Max = daySummary.Count;
            }
        }
    }
}