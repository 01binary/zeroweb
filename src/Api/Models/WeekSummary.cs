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
        public IDictionary<int, string> Articles { get; set; }

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
            this.Articles = new Dictionary<int, string>();
        }

        /// <summary>
        /// Aggregate tags for this week.
        /// </summary>
        /// <param name="articleId">The article the tag is for.</param>
        /// <param name="articleTitle">The article title.</param>
        /// <param name="tag">The tag to aggregate.</param>
        public void Aggregate(int articleId, string articleTitle, string tag)
        {
            int tagCount;
            this.Tags.TryGetValue(tag, out tagCount);
            this.Tags[tag] = tagCount + 1;
            this.Total++;

            if (!this.Articles.ContainsKey(articleId))
            {
                this.Articles.Add(articleId, articleTitle);
            }
        }
    }
}