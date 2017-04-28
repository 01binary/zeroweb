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
    using System.Collections.Generic;

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
        /// Gets or sets the articles aggregated for the week by Id.
        /// </summary>
        public IDictionary<string, string> Articles { get; set; }

        /// <summary>
        /// The display offset of this week within the month.
        /// (i.e. defined first but displayed second because first week had no articles).
        /// </summary>
        public int Offset { get; set; }

        /// <summary>
        // Gets or sets the tag count for the week.
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="WeekSummary"/> class.
        /// </summary>
        /// <param name="offset">The offset from start of month.</param>
        public WeekSummary(int offset)
        {
            this.Tags = new Dictionary<string, int>();
            this.Articles = new Dictionary<string, string>();
            this.Offset = offset;
        }

        /// <summary>
        /// Aggregate tags for this week.
        /// </summary>
        /// <param name="articleKey">The unique article key used in permalinks.</param>
        /// <param name="articleTitle">The article title.</param>
        /// <param name="tag">The tag to aggregate.</param>
        /// <returns>The total tag count for the week.</param>
        public int Aggregate(string articleKey, string articleTitle, string tag)
        {
            if (!this.Articles.ContainsKey(articleKey))
            {
                this.Articles.Add(articleKey, articleTitle);
            }

            this.AggregateTag(tag, 1);

            return this.Total;
        }

        /// <summary>
        /// Merge with another week summary.
        /// </summary>
        /// <param name="merge">The week summary to merge with.</param>
        public void Merge(WeekSummary merge)
        {
            foreach (var article in merge.Articles)
            {
                this.Articles[article.Key] = article.Value;
            }

            foreach (var tag in merge.Tags)
            {
                this.AggregateTag(tag.Key, tag.Value);
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
    }
}