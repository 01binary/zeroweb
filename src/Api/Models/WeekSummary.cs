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
        // Gets or sets the tag count for the week.
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="WeekSummary"/> class.
        /// </summary>
        public WeekSummary()
        {
            this.Tags = new Dictionary<string, int>();
            this.Articles = new Dictionary<string, string>();
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

            int tagCount;
            this.Tags.TryGetValue(tag, out tagCount);
            this.Tags[tag] = tagCount + 1;
            
            return ++this.Total;
        }
    }
}