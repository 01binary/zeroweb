/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines the week contribution summary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Models
{
    using System;
    using System.Collections.Generic;
    using Newtonsoft.Json;

    /// <summary>
    /// The week contribution summary.
    /// </summary>
    public class WeekSummary
    {
        /// <summary>
        /// Gets or sets the count of tags aggregated for the week.
        /// </summary>
        public IDictionary<string, int> Tags { get; set; }

        /// <summary>
        /// Gets or sets the count of articles aggregated for each day.
        /// </summary>
        public IDictionary<string, int> Days { get; set; }

        /// <summary>
        /// Gets or sets the articles aggregated for the week by Id.
        /// </summary>
        public IList<string> Articles { get; set; }

        /// <summary>
        /// Gets or sets the unique article keys.
        /// </summary>
        [JsonIgnore]
        public IDictionary<string, string> UniqueArticles { get; set; }

        /// <summary>
        /// The display offset of this week within the month.
        /// </summary>
        public int Offset { get; set; }

        /// <summary>
        // Gets or sets the max tags for a week day.
        /// </summary>
        public int Max { get; set; }

        /// <summary>
        // Gets or sets the tag count for the week.
        /// </summary>
        [JsonIgnore]
        public int Total { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="WeekSummary"/> class.
        /// </summary>
        /// <param name="offset">The offset from start of month.</param>
        public WeekSummary(int offset)
        {
            this.Tags = new Dictionary<string, int>();
            this.Days = new Dictionary<string, int>();
            this.Articles = new List<string>();
            this.UniqueArticles = new Dictionary<string, string>();
            this.Offset = offset;
        }

        /// <summary>
        /// Aggregate tags for this week.
        /// </summary>
        /// <param name="date">The article date.</param>
        /// <param name="key">The unique article key used in permalinks.</param>
        /// <param name="title">The article title.</param>
        /// <param name="tag">The tag to aggregate.</param>
        /// <returns>The total tag count for the week.</param>
        public int Aggregate(DateTime date, string key, string title, string tag)
        {
            if (!this.UniqueArticles.ContainsKey(key))
            {
                this.UniqueArticles.Add(key, title);
                this.Articles.Add(title);
                this.AggregateTag(tag, 1);
                this.AggregateDay(date.ToString("ddd").ToLower(), 1);
            }

            return this.Total;
        }

        /// <summary>
        /// Merge with another week summary.
        /// </summary>
        /// <param name="merge">The week summary to merge with.</param>
        public void Merge(WeekSummary merge)
        {
            foreach (var article in merge.UniqueArticles)
            {
                this.UniqueArticles[article.Key] = article.Value;
                this.Articles.Add(article.Value);
            }

            foreach (var tag in merge.Tags)
            {
                this.AggregateTag(tag.Key, tag.Value);
            }

            foreach (var day in merge.Days)
            {
                this.AggregateDay(day.Key, day.Value);
            }
        }

        /// <summary>
        /// Aggregate count for the specified tag.
        /// </summary>
        /// <param name="merge">The week summary to merge with.</param>
        private void AggregateTag(string tag, int count)
        {
            int tagCount;
            this.Tags.TryGetValue(tag, out tagCount);
            this.Tags[tag] = tagCount + count;
            this.Total += count;
        }

        /// <summary>
        /// Aggregate count for the specified week day.
        /// </summary>
        /// <param name="weekDay">The week day to aggregate count for.</param>
        /// <param name="count">The number of articles to aggregate on that day.</param>
        private void AggregateDay(string weekDay, int count)
        {
            int dayCount = 0;
            this.Days.TryGetValue(weekDay, out dayCount);
            this.Days[weekDay] = dayCount += count;

            if (dayCount > this.Max)
            {
                this.Max = dayCount;
            }
        }
    }
}