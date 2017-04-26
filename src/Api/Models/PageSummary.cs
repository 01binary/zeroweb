/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Paginates the weekly contribution summary.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Models
{
    /// <summary>
    /// Maps week summaries to a page.
    /// </summary>
    public class PageSummary
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PageSummary"/> class.
        /// </summary>
        /// <param name="start">The start of page range.</param>
        /// <param name="end">The end of page range.</param>
        public PageSummary(WeekMapping start, WeekMapping end)
        {
            this.Start = start;
            this.End = end;
        }

        /// <summary>
        /// The first week summary to display on this page.
        /// </summary>
        public WeekMapping Start { get; set; }

        /// <summary>
        /// The last week summary to display on this page.
        /// </summary>
        public WeekMapping End { get; set; }
    }
}