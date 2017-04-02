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
    using System.Collections.Generic;

    /// <summary>
    /// The monthly contribution summary.
    /// </summary>
    public class MonthSummary
    {
        /// <summary>
        /// Gets or sets the tag counts.
        /// </summary>
        public IDictionary<string, int> Tags { get; set; }

        /// <summary>
        /// Gets or sets the total tag count.
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// Gets or sets the week summaries.
        /// </summary>
        public IDictionary<string, WeekSummary> Weeks { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="MonthSummary"/> class.
        /// </summary>
        public MonthSummary()
        {
            this.Tags = new Dictionary<string, int>();
            this.Weeks = new Dictionary<string, WeekSummary>();
        }

        public int Aggregate(string weekName, string tag)
        {
            // Aggregate tags for the month.
            if (this.Tags.ContainsKey(tag))
            {
                this.Tags[tag] = this.Tags[tag] + 1;
            }
            else
            {
                this.Tags[tag] = 1;
            }

            // Aggregate tags for the week.
            this.GetOrCreateWeek(weekName).Aggregate(tag);

            // Aggregate tag totals.
            return ++this.Total;
        }

        private WeekSummary GetOrCreateWeek(string weekName)
        {
            if (this.Weeks.ContainsKey(weekName))
            {
                return this.Weeks[weekName];
            }

            return this.Weeks[weekName] = new WeekSummary();
        }
    }
}