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
        /// The first week summary to display on this page.
        /// </summary>
        PageSummaryMapping Start { get; set; }

        /// <summary>
        /// The last week summary to display on this page.
        /// </summary>
        PageSummaryMapping End { get; set; }
    }
}