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
    public class WeekMapping
    {
        /// <summary>
        /// Initializes a new object of the <see cref="WeekMapping"/> class.
        /// </summary>
        /// <param name="month">The month name.</param>
        /// <param name="week">The week index int he month.</param>
        public WeekMapping(string month, int week)
        {
            this.Month = month;
            this.Week = week;
        }

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