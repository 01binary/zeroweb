/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  Defines a reference to week summary for a page bound.
|----------------------------------------------------------
|  Copyright(C) 2017 Valeriy Novytskyy
\*---------------------------------------------------------*/

namespace ZeroWeb.Api.Models
{
    /// <summary>
    /// Weekly contribution page mapping.
    /// </summary>
    public class WeekSummaryMapping
    {
        /// <summary>
        /// Gets or sets the month.
        /// </summary>
        public string Month { get; set; }

        /// <summary>
        /// Gets or sets the week index in month.
        /// </summary>
        public int Week { get; set; }
    }
}